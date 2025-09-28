import { Test, TestingModule } from '@nestjs/testing';
import { WorksResolver } from './works.resolver';
import { WorksService } from './works.service';

describe('WorksResolver', () => {
  let resolver: WorksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorksResolver, WorksService]
    }).compile();

    resolver = module.get<WorksResolver>(WorksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
