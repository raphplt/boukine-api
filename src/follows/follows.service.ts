import { Injectable } from '@nestjs/common';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';

@Injectable()
export class FollowsService {
  create(createFollowInput: CreateFollowInput) {
    return 'This action adds a new follow';
  }

  findAll() {
    return `This action returns all follows`;
  }

  findOne(id: string) {
    return `This action returns a #${id} follow`;
  }

  update(id: string, updateFollowInput: UpdateFollowInput) {
    return `This action updates a #${id} follow`;
  }

  remove(id: string) {
    return `This action removes a #${id} follow`;
  }
}
