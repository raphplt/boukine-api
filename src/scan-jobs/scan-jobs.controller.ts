import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { ScanJobsService } from './scan-jobs.service';
import { CreateScanJobDto } from './dto/create-scan-job.dto';
import { UpdateScanJobDto } from './dto/update-scan-job.dto';

@Controller('scan-jobs')
export class ScanJobsController {
  constructor(private readonly scanJobsService: ScanJobsService) {}

  @Post()
  create(@Body() createScanJobDto: CreateScanJobDto) {
    return this.scanJobsService.create(createScanJobDto);
  }

  @Get()
  findAll() {
    return this.scanJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scanJobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScanJobDto: UpdateScanJobDto) {
    return this.scanJobsService.update(+id, updateScanJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scanJobsService.remove(+id);
  }
}
