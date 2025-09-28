import { Injectable } from '@nestjs/common';
import { CreateBookIdentifierDto } from './dto/create-book-identifier.dto';
import { UpdateBookIdentifierDto } from './dto/update-book-identifier.dto';

@Injectable()
export class BookIdentifiersService {
  create(createBookIdentifierDto: CreateBookIdentifierDto) {
    return 'This action adds a new bookIdentifier';
  }

  findAll() {
    return `This action returns all bookIdentifiers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookIdentifier`;
  }

  update(id: number, updateBookIdentifierDto: UpdateBookIdentifierDto) {
    return `This action updates a #${id} bookIdentifier`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookIdentifier`;
  }
}
