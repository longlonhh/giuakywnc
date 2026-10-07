import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

/** CÂU 3.2 - DTO tạo mới sách */
export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'title (tên sách) không được để trống' })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'author (tác giả) không được để trống' })
  @MaxLength(255)
  author: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  isbn?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'totalCopies phải lớn hơn hoặc bằng 1' })
  totalCopies?: number;
}
