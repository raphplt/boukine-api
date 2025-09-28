import { Injectable } from '@nestjs/common';
import { CreateScanJobDto } from './dto/create-scan-job.dto';
import { UpdateScanJobDto } from './dto/update-scan-job.dto';

@Injectable()
export class ScanJobsService {
  create(createScanJobDto: CreateScanJobDto) {
    return 'This action adds a new scanJob';
  }

  findAll() {
    return `This action returns all scanJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scanJob`;
  }

  update(id: number, updateScanJobDto: UpdateScanJobDto) {
    return `This action updates a #${id} scanJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} scanJob`;
  }
}
