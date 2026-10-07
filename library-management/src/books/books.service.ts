import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

/** CÂU 3.2 - BooksService: xử lý nghiệp vụ Sách */
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.booksRepository.create({
      ...createBookDto,
      availableCopies: createBookDto.totalCopies ?? 1,
    });
    return this.booksRepository.save(book);
  }

  findAll(): Promise<Book[]> {
    return this.booksRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Không tìm thấy sách có id = ${id}`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // Điều chỉnh số bản còn lại khi tổng số bản thay đổi
    if (
      updateBookDto.totalCopies !== undefined &&
      updateBookDto.totalCopies !== book.totalCopies
    ) {
      const delta = updateBookDto.totalCopies - book.totalCopies;
      book.availableCopies = Math.max(0, book.availableCopies + delta);
    }

    Object.assign(book, updateBookDto);
    return this.booksRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }
}
