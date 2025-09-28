import { Test, TestingModule } from '@nestjs/testing';
import { CollectionItemsResolver } from './collection-items.resolver';
import { CollectionItemsService } from './collection-items.service';

describe('CollectionItemsResolver', () => {
  let resolver: CollectionItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionItemsResolver, CollectionItemsService]
    }).compile();

    resolver = module.get<CollectionItemsResolver>(CollectionItemsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
