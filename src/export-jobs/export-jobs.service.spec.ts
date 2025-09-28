import { Test, TestingModule } from '@nestjs/testing';
import { ExportJobsService } from './export-jobs.service';

describe('ExportJobsService', () => {
  let service: ExportJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportJobsService],
    }).compile();

    service = module.get<ExportJobsService>(ExportJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
