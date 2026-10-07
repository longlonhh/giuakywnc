import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BorrowedRecord } from '../../borrows/entities/borrowed-record.entity';

/**
 * CÂU 2 - Thực thể ĐỘC GIẢ (Reader)
 */
@Entity('readers')
export class Reader {
  @PrimaryGeneratedColumn()
  id: number;

  /** Họ và tên độc giả */
  @Column({ length: 255, name: 'full_name' })
  fullName: string;

  /** Email liên hệ (duy nhất) */
  @Column({ length: 255, unique: true })
  email: string;

  /** Số điện thoại */
  @Column({ length: 20, nullable: true })
  phone: string | null;

  /** Địa chỉ */
  @Column({ length: 255, nullable: true })
  address: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /** Các phiếu mượn của độc giả này */
  @OneToMany(() => BorrowedRecord, (borrowedRecord) => borrowedRecord.reader)
  borrowRecords: BorrowedRecord[];
}
