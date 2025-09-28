import { Test, TestingModule } from '@nestjs/testing';
import { CollectionItemsService } from './collection-items.service';

describe('CollectionItemsService', () => {
  let service: CollectionItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionItemsService]
    }).compile();

    service = module.get<CollectionItemsService>(CollectionItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
