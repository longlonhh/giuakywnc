import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/** CÂU 3.2 - DTO cập nhật độc giả */
export class UpdateReaderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email không đúng định dạng' })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
