import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImportJobsService } from './import-jobs.service';
import { CreateImportJobDto } from './dto/create-import-job.dto';
import { UpdateImportJobDto } from './dto/update-import-job.dto';

@Controller('import-jobs')
export class ImportJobsController {
  constructor(private readonly importJobsService: ImportJobsService) {}

  @Post()
  create(@Body() createImportJobDto: CreateImportJobDto) {
    return this.importJobsService.create(createImportJobDto);
  }

  @Get()
  findAll() {
    return this.importJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importJobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportJobDto: UpdateImportJobDto) {
    return this.importJobsService.update(+id, updateImportJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importJobsService.remove(+id);
  }
}
