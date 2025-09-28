import { Module } from '@nestjs/common';
import { CollectionItemsService } from './collection-items.service';
import { CollectionItemsResolver } from './collection-items.resolver';

@Module({
  providers: [CollectionItemsResolver, CollectionItemsService]
})
export class CollectionItemsModule {}
