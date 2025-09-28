import { Module } from '@nestjs/common';
import { EditionsService } from './editions.service';
import { EditionsResolver } from './editions.resolver';

@Module({
  providers: [EditionsResolver, EditionsService],
})
export class EditionsModule {}
