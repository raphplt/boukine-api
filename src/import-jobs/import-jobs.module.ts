import { Module } from '@nestjs/common';
import { ImportJobsService } from './import-jobs.service';
import { ImportJobsController } from './import-jobs.controller';

@Module({
  controllers: [ImportJobsController],
  providers: [ImportJobsService],
})
export class ImportJobsModule {}
