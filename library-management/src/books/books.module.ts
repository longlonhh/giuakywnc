import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

/** CÂU 3.2 - BooksModule: gom các lớp liên quan đến Sách */
@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
