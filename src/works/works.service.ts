import { Injectable } from '@nestjs/common';
import { CreateWorkInput } from './dto/create-work.input';
import { UpdateWorkInput } from './dto/update-work.input';

@Injectable()
export class WorksService {
  create(createWorkInput: CreateWorkInput) {
    return 'This action adds a new work';
  }

  findAll() {
    return `This action returns all works`;
  }

  findOne(id: number) {
    return `This action returns a #${id} work`;
  }

  update(id: number, updateWorkInput: UpdateWorkInput) {
    return `This action updates a #${id} work`;
  }

  remove(id: number) {
    return `This action removes a #${id} work`;
  }
}
