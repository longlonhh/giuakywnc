import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Reader } from '../../readers/entities/reader.entity';

/**
 * CÂU 2 - Thực thể ĐỘC GIẢ MƯỢN SÁCH (BorrowedRecord)
 * - Quan hệ Many-To-One tới Book và Reader
 * - borrowedDate: ngày mượn
 * - dueDate: hạn trả sách
 * - returnedDate: ngày trả thực tế (null => chưa trả)
 */
@Entity('borrowed_records')
export class BorrowedRecord {
  @PrimaryGeneratedColumn()
  id: number;

  /** Sách được mượn (FK -> books.id) */
  @ManyToOne(() => Book, (book) => book.borrowRecords, { nullable: false })
  @JoinColumn({ name: 'book_id' })
  book: Book;
  /** Độc giả mượn sách (FK -> readers.id) */
  @ManyToOne(() => Reader, (reader) => reader.borrowRecords, {
    nullable: false,
  })
  @JoinColumn({ name: 'reader_id' })
  reader: Reader;

  /** Ngày mượn */
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  borrowedDate: Date;

  /** Hạn trả sách */
  @Column({ type: 'timestamptz' })
  dueDate: Date;

  /** Ngày trả thực tế (null = đang mượn) */
  @Column({ type: 'timestamptz', nullable: true })
  returnedDate: Date | null;
}
