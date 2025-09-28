import { Injectable } from '@nestjs/common';
import { CreateExportJobDto } from './dto/create-export-job.dto';
import { UpdateExportJobDto } from './dto/update-export-job.dto';

@Injectable()
export class ExportJobsService {
  create(createExportJobDto: CreateExportJobDto) {
    return 'This action adds a new exportJob';
  }

  findAll() {
    return `This action returns all exportJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exportJob`;
  }

  update(id: number, updateExportJobDto: UpdateExportJobDto) {
    return `This action updates a #${id} exportJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} exportJob`;
  }
}
