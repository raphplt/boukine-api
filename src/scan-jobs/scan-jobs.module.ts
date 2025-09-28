import { Module } from '@nestjs/common';
import { ScanJobsService } from './scan-jobs.service';
import { ScanJobsController } from './scan-jobs.controller';

@Module({
  controllers: [ScanJobsController],
  providers: [ScanJobsService],
})
export class ScanJobsModule {}
