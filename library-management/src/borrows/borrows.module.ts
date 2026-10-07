import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowedRecord } from './entities/borrowed-record.entity';
import { BorrowsController } from './borrows.controller';
import { BorrowsService } from './borrows.service';

/** CÂU 3.2 - BorrowsModule: gom các lớp liên quan đến mượn sách */
@Module({
  imports: [TypeOrmModule.forFeature([BorrowedRecord])],
  controllers: [BorrowsController],
  providers: [BorrowsService],
})
export class BorrowsModule {}
