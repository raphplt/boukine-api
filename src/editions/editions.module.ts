import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditionsService } from './editions.service';
import { EditionsResolver } from './editions.resolver';
import { Edition } from './entities/edition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Edition])],
  providers: [EditionsResolver, EditionsService],
  exports: [EditionsService]
})
export class EditionsModule {}
