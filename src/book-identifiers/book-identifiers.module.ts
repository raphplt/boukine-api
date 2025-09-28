import { Module } from '@nestjs/common';
import { BookIdentifiersService } from './book-identifiers.service';
import { BookIdentifiersController } from './book-identifiers.controller';

@Module({
  controllers: [BookIdentifiersController],
  providers: [BookIdentifiersService],
})
export class BookIdentifiersModule {}
