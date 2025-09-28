import { Test, TestingModule } from '@nestjs/testing';
import { ImportJobsController } from './import-jobs.controller';
import { ImportJobsService } from './import-jobs.service';

describe('ImportJobsController', () => {
  let controller: ImportJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportJobsController],
      providers: [ImportJobsService]
    }).compile();

    controller = module.get<ImportJobsController>(ImportJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
