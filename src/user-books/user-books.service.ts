import { Injectable } from '@nestjs/common';
import { CreateUserBookInput } from './dto/create-user-book.input';
import { UpdateUserBookInput } from './dto/update-user-book.input';

@Injectable()
export class UserBooksService {
  create(createUserBookInput: CreateUserBookInput) {
    return 'This action adds a new userBook';
  }

  findAll() {
    return `This action returns all userBooks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userBook`;
  }

  update(id: number, updateUserBookInput: UpdateUserBookInput) {
    return `This action updates a #${id} userBook`;
  }

  remove(id: number) {
    return `This action removes a #${id} userBook`;
  }
}
