import { Injectable } from '@nestjs/common';
import { CreateEditionInput } from './dto/create-edition.input';
import { UpdateEditionInput } from './dto/update-edition.input';

@Injectable()
export class EditionsService {
  create(createEditionInput: CreateEditionInput) {
    return 'This action adds a new edition';
  }

  findAll() {
    return `This action returns all editions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} edition`;
  }

  update(id: number, updateEditionInput: UpdateEditionInput) {
    return `This action updates a #${id} edition`;
  }

  remove(id: number) {
    return `This action removes a #${id} edition`;
  }
}
