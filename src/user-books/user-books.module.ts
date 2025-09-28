import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBooksService } from './user-books.service';
import { UserBooksResolver } from './user-books.resolver';
import { UserBook } from './entities/user-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBook])],
  providers: [UserBooksResolver, UserBooksService],
  exports: [UserBooksService]
})
export class UserBooksModule {}
