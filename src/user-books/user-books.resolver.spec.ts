import { Test, TestingModule } from '@nestjs/testing';
import { UserBooksResolver } from './user-books.resolver';
import { UserBooksService } from './user-books.service';

describe('UserBooksResolver', () => {
  let resolver: UserBooksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBooksResolver, UserBooksService],
    }).compile();

    resolver = module.get<UserBooksResolver>(UserBooksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
