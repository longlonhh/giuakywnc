import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { Reader } from '../readers/entities/reader.entity';
import { BorrowedRecord } from './entities/borrowed-record.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';

/** Số ngày mượn mặc định */
const DEFAULT_BORROW_DAYS = 14;

/** CÂU 3.2 / 3.3 / 3.4 - BorrowsService: nghiệp vụ mượn trả sách */
@Injectable()
export class BorrowsService {
  constructor(
    @InjectRepository(BorrowedRecord)
    private readonly borrowsRepository: Repository<BorrowedRecord>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * CÂU 3.3 - Độc giả mượn sách, lưu dữ liệu vào BorrowedRecord.
   * - Kiểm tra sách và độc giả tồn tại
   * - Kiểm tra sách còn bản để cho mượn (availableCopies > 0)
   * - Giảm availableCopies của sách đi 1
   * - Ghi phiếu mượn: borrowedDate = hôm nay, dueDate = hôm nay + số ngày mượn
   */
  async create(createBorrowDto: CreateBorrowDto): Promise<BorrowedRecord> {
    const { readerId, bookId, days = DEFAULT_BORROW_DAYS } = createBorrowDto;

    return this.dataSource.transaction(async (manager) => {
      const book = await manager.findOne(Book, { where: { id: bookId } });
      if (!book) {
        throw new NotFoundException(`Không tìm thấy sách có id = ${bookId}`);
      }
      if (book.availableCopies < 1) {
        throw new ConflictException(
          `Sách "${book.title}" đã hết bản để cho mượn`,
        );
      }

      const reader = await manager.findOne(Reader, { where: { id: readerId } });
      if (!reader) {
        throw new NotFoundException(`Không tìm thấy độc giả có id = ${readerId}`);
      }

      // Giảm số bản còn lại của sách
      book.availableCopies -= 1;
      await manager.save(book);

      // Tạo phiếu mượn (BorrowedRecord)
      const borrowedDate = new Date();
      const dueDate = new Date(
        borrowedDate.getTime() + days * 24 * 60 * 60 * 1000,
      );

      const borrowedRecord = manager.create(BorrowedRecord, {
        book,
        reader,
        borrowedDate,
        dueDate,
        returnedDate: null,
      });
      return manager.save(borrowedRecord);
    });
  }

  /**
   * CÂU 3.4 - Liệt kê danh sách sách đã được mượn
   * kèm ngày mượn (borrowedDate), người mượn (reader), hạn trả (dueDate).
   * Mặc định chỉ liệt kê các phiếu đang mượn (chưa trả).
   * Truyền ?active=false để liệt kê tất cả (kể cả đã trả).
   */
  findAll(activeOnly = true): Promise<BorrowedRecord[]> {
    return this.borrowsRepository.find({
      relations: { book: true, reader: true },
      where: activeOnly ? { returnedDate: IsNull() } : {},
      order: { borrowedDate: 'DESC' },
    });
  }

  /** (Bổ sung) Trả sách: cập nhật returnedDate và hoàn lại số bản sách */
  async returnBook(id: number): Promise<BorrowedRecord> {
    return this.dataSource.transaction(async (manager) => {
      const borrowedRecord = await manager.findOne(BorrowedRecord, {
        where: { id },
        relations: { book: true },
      });
      if (!borrowedRecord) {
        throw new NotFoundException(`Không tìm thấy phiếu mượn có id = ${id}`);
      }
      if (borrowedRecord.returnedDate) {
        throw new ConflictException(
          `Phiếu mượn #${id} đã được trả trước đó (ngày ${borrowedRecord.returnedDate.toISOString()})`,
        );
      }

      borrowedRecord.returnedDate = new Date();
      borrowedRecord.book.availableCopies += 1;
      await manager.save(borrowedRecord.book);
      return manager.save(borrowedRecord);
    });
  }
}
