import { Test, TestingModule } from '@nestjs/testing';
import { ExportJobsController } from './export-jobs.controller';
import { ExportJobsService } from './export-jobs.service';

describe('ExportJobsController', () => {
  let controller: ExportJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportJobsController],
      providers: [ExportJobsService],
    }).compile();

    controller = module.get<ExportJobsController>(ExportJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
