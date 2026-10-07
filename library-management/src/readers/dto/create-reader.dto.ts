import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/** CÂU 3.2 - DTO tạo mới độc giả */
export class CreateReaderDto {
  @IsString()
  @IsNotEmpty({ message: 'fullName (họ tên) không được để trống' })
  @MaxLength(255)
  fullName: string;

  @IsEmail({}, { message: 'email không đúng định dạng' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
