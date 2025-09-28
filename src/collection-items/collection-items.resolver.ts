import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CollectionItemsService } from './collection-items.service';
import { CollectionItem } from './entities/collection-item.entity';
import { CreateCollectionItemInput } from './dto/create-collection-item.input';
import { UpdateCollectionItemInput } from './dto/update-collection-item.input';

@Resolver(() => CollectionItem)
export class CollectionItemsResolver {
  constructor(
    private readonly collectionItemsService: CollectionItemsService
  ) {}

  @Mutation(() => CollectionItem)
  createCollectionItem(
    @Args('createCollectionItemInput')
    createCollectionItemInput: CreateCollectionItemInput
  ) {
    return this.collectionItemsService.create(createCollectionItemInput);
  }

  @Query(() => [CollectionItem], { name: 'collectionItems' })
  findAll() {
    return this.collectionItemsService.findAll();
  }

  @Query(() => CollectionItem, { name: 'collectionItem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.collectionItemsService.findOne(id);
  }

  @Mutation(() => CollectionItem)
  updateCollectionItem(
    @Args('updateCollectionItemInput')
    updateCollectionItemInput: UpdateCollectionItemInput
  ) {
    return this.collectionItemsService.update(
      updateCollectionItemInput.id,
      updateCollectionItemInput
    );
  }

  @Mutation(() => CollectionItem)
  removeCollectionItem(@Args('id', { type: () => Int }) id: number) {
    return this.collectionItemsService.remove(id);
  }
}
