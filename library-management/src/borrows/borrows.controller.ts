import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

/** CÂU 3.3 / 3.4 - BorrowsController: API mượn trả sách */
@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  /**
   * CÂU 3.3 - Độc giả mượn sách
   * Body: { "readerId": 1, "bookId": 1, "days": 14 }
   */
  @Post()
  create(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowsService.create(createBorrowDto);
  }

  /**
   * CÂU 3.4 - Liệt kê danh sách sách đã được mượn
   * (ngày mượn, người mượn, hạn trả sách)
   * Mặc định chỉ lấy các phiếu đang mượn; ?active=false để lấy tất cả.
   */
  @Get()
  findAll(@Query('active') active?: string) {
    return this.borrowsService.findAll(active !== 'false');
  }

  /** (Bổ sung) Trả sách */
  @Patch(':id/return')
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.borrowsService.returnBook(id);
  }
}
