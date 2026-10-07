import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ReadersService } from './readers.service';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';

/** CÂU 3.2 - ReadersController: API CRUD Độc giả */
@Controller('readers')
export class ReadersController {
  constructor(private readonly readersService: ReadersService) {}

  @Post()
  create(@Body() createReaderDto: CreateReaderDto) {
    return this.readersService.create(createReaderDto);
  }

  @Get()
  findAll() {
    return this.readersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.readersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReaderDto: UpdateReaderDto,
  ) {
    return this.readersService.update(id, updateReaderDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.readersService.remove(id);
    return { message: `Đã xóa độc giả có id = ${id}` };
  }
}
