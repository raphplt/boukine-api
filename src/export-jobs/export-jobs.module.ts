import { Module } from '@nestjs/common';
import { ExportJobsService } from './export-jobs.service';
import { ExportJobsController } from './export-jobs.controller';

@Module({
  controllers: [ExportJobsController],
  providers: [ExportJobsService],
})
export class ExportJobsModule {}
