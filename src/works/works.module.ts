import { Module } from '@nestjs/common';
import { WorksService } from './works.service';
import { WorksResolver } from './works.resolver';

@Module({
  providers: [WorksResolver, WorksService],
})
export class WorksModule {}
