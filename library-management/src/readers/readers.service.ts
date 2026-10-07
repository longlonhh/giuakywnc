import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reader } from './entities/reader.entity';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';

/** CÂU 3.2 - ReadersService: xử lý nghiệp vụ Độc giả */
@Injectable()
export class ReadersService {
  constructor(
    @InjectRepository(Reader)
    private readonly readersRepository: Repository<Reader>,
  ) {}

  async create(createReaderDto: CreateReaderDto): Promise<Reader> {
    const existed = await this.readersRepository.findOne({
      where: { email: createReaderDto.email },
    });
    if (existed) {
      throw new ConflictException(
        `Email ${createReaderDto.email} đã được đăng ký bởi độc giả khác`,
      );
    }

    const reader = this.readersRepository.create(createReaderDto);
    return this.readersRepository.save(reader);
  }

  findAll(): Promise<Reader[]> {
    return this.readersRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Reader> {
    const reader = await this.readersRepository.findOne({ where: { id } });
    if (!reader) {
      throw new NotFoundException(`Không tìm thấy độc giả có id = ${id}`);
    }
    return reader;
  }

  async update(id: number, updateReaderDto: UpdateReaderDto): Promise<Reader> {
    const reader = await this.findOne(id);
    Object.assign(reader, updateReaderDto);
    return this.readersRepository.save(reader);
  }

  async remove(id: number): Promise<void> {
    const reader = await this.findOne(id);
    await this.readersRepository.remove(reader);
  }
}
