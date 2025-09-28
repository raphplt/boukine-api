import { Injectable } from '@nestjs/common';
import { CreateReactionInput } from './dto/create-reaction.input';
import { UpdateReactionInput } from './dto/update-reaction.input';

@Injectable()
export class ReactionsService {
  create(createReactionInput: CreateReactionInput) {
    return 'This action adds a new reaction';
  }

  findAll() {
    return `This action returns all reactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  update(id: number, updateReactionInput: UpdateReactionInput) {
    return `This action updates a #${id} reaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
}
