import { IsInt, IsOptional, Max, Min } from 'class-validator';

/** CÂU 3.3 - DTO độc giả mượn sách */
export class CreateBorrowDto {
  /** Mã độc giả */
  @IsInt({ message: 'readerId phải là số nguyên' })
  readerId: number;

  /** Mã sách muốn mượn */
  @IsInt({ message: 'bookId phải là số nguyên' })
  bookId: number;

  /** Số ngày được mượn (không truyền thì mặc định 14 ngày) */
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'days phải lớn hơn hoặc bằng 1' })
  @Max(90, { message: 'days không được vượt quá 90 ngày' })
  days?: number;
}
