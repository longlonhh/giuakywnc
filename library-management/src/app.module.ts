import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { ReadersModule } from './readers/readers.module';
import { BorrowsModule } from './borrows/borrows.module';

@Module({
  imports: [
    // Nạp biến môi trường từ file .env
    ConfigModule.forRoot({ isGlobal: true }),

    // CÂU 3.1 - Kết nối CSDL PostgreSQL (Local hoặc Aiven) qua .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'library_db'),
        // Aiven yêu cầu SSL: đặt DB_SSL=true trong .env
        ssl:
          configService.get('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        autoLoadEntities: true,
        synchronize: true, // CHỈ dùng cho môi trường học tập/dev
      }),
    }),

    // CÂU 3.2 - Các module nghiệp vụ
    BooksModule,
    ReadersModule,
    BorrowsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
