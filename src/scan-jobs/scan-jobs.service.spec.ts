import { Test, TestingModule } from '@nestjs/testing';
import { ScanJobsService } from './scan-jobs.service';

describe('ScanJobsService', () => {
  let service: ScanJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScanJobsService]
    }).compile();

    service = module.get<ScanJobsService>(ScanJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
