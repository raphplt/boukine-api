import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExportJobsService } from './export-jobs.service';
import { CreateExportJobDto } from './dto/create-export-job.dto';
import { UpdateExportJobDto } from './dto/update-export-job.dto';

@Controller('export-jobs')
export class ExportJobsController {
  constructor(private readonly exportJobsService: ExportJobsService) {}

  @Post()
  create(@Body() createExportJobDto: CreateExportJobDto) {
    return this.exportJobsService.create(createExportJobDto);
  }

  @Get()
  findAll() {
    return this.exportJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportJobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExportJobDto: UpdateExportJobDto) {
    return this.exportJobsService.update(+id, updateExportJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exportJobsService.remove(+id);
  }
}
