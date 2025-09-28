import { Test, TestingModule } from '@nestjs/testing';
import { ScanJobsController } from './scan-jobs.controller';
import { ScanJobsService } from './scan-jobs.service';

describe('ScanJobsController', () => {
  let controller: ScanJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanJobsController],
      providers: [ScanJobsService]
    }).compile();

    controller = module.get<ScanJobsController>(ScanJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
