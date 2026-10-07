import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BorrowedRecord } from '../../borrows/entities/borrowed-record.entity';

/**
 * CÂU 2 - Thực thể SÁCH (Book)
 */
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  /** Tên sách */
  @Column({ length: 255 })
  title: string;

  /** Tác giả */
  @Column({ length: 255 })
  author: string;

  /** Mã ISBN */
  @Column({ length: 50, nullable: true })
  isbn: string | null;

  /** Tổng số bản sách */
  @Column({ type: 'int', default: 1 })
  totalCopies: number;

  /** Số bản còn lại có thể cho mượn */
  @Column({ type: 'int', default: 1 })
  availableCopies: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /** Các phiếu mượn của sách này */
  @OneToMany(() => BorrowedRecord, (borrowedRecord) => borrowedRecord.book)
  borrowRecords: BorrowedRecord[];
}
