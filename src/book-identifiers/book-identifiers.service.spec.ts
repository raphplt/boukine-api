import { Test, TestingModule } from '@nestjs/testing';
import { BookIdentifiersService } from './book-identifiers.service';

describe('BookIdentifiersService', () => {
  let service: BookIdentifiersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookIdentifiersService]
    }).compile();

    service = module.get<BookIdentifiersService>(BookIdentifiersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
