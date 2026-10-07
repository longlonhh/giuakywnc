import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

/** CÂU 3.2 - DTO cập nhật sách (tất cả các trường đều tùy chọn) */
export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  isbn?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalCopies?: number;
}
