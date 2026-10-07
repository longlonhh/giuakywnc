import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reader } from './entities/reader.entity';
import { ReadersController } from './readers.controller';
import { ReadersService } from './readers.service';

/** CÂU 3.2 - ReadersModule: gom các lớp liên quan đến Độc giả */
@Module({
  imports: [TypeOrmModule.forFeature([Reader])],
  controllers: [ReadersController],
  providers: [ReadersService],
})
export class ReadersModule {}
