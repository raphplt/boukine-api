import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorksService } from './works.service';
import { WorksResolver } from './works.resolver';
import { BookWork } from './entities/work.entity';
import { BookWorkAuthor } from './entities/book-work-author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookWork, BookWorkAuthor])],
  providers: [WorksResolver, WorksService],
  exports: [WorksService]
})
export class WorksModule {}
