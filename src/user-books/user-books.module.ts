import { Module } from '@nestjs/common';
import { UserBooksService } from './user-books.service';
import { UserBooksResolver } from './user-books.resolver';

@Module({
  providers: [UserBooksResolver, UserBooksService],
})
export class UserBooksModule {}
