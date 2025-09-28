import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsService } from './collections.service';
import { CollectionsResolver } from './collections.resolver';
import { Collection } from './entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  providers: [CollectionsResolver, CollectionsService],
  exports: [CollectionsService]
})
export class CollectionsModule {}
