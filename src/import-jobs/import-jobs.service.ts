import { Injectable } from '@nestjs/common';
import { CreateImportJobDto } from './dto/create-import-job.dto';
import { UpdateImportJobDto } from './dto/update-import-job.dto';

@Injectable()
export class ImportJobsService {
  create(createImportJobDto: CreateImportJobDto) {
    return 'This action adds a new importJob';
  }

  findAll() {
    return `This action returns all importJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} importJob`;
  }

  update(id: number, updateImportJobDto: UpdateImportJobDto) {
    return `This action updates a #${id} importJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} importJob`;
  }
}
