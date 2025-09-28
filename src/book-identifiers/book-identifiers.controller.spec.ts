import { Test, TestingModule } from '@nestjs/testing';
import { BookIdentifiersController } from './book-identifiers.controller';
import { BookIdentifiersService } from './book-identifiers.service';

describe('BookIdentifiersController', () => {
  let controller: BookIdentifiersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookIdentifiersController],
      providers: [BookIdentifiersService],
    }).compile();

    controller = module.get<BookIdentifiersController>(BookIdentifiersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
