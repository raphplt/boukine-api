import { Test, TestingModule } from '@nestjs/testing';
import { ImportJobsService } from './import-jobs.service';

describe('ImportJobsService', () => {
  let service: ImportJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportJobsService]
    }).compile();

    service = module.get<ImportJobsService>(ImportJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
