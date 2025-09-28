import { Test, TestingModule } from '@nestjs/testing';
import { EditionsResolver } from './editions.resolver';
import { EditionsService } from './editions.service';

describe('EditionsResolver', () => {
  let resolver: EditionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditionsResolver, EditionsService],
    }).compile();

    resolver = module.get<EditionsResolver>(EditionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
