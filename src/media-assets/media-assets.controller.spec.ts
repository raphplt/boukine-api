import { Test, TestingModule } from '@nestjs/testing';
import { MediaAssetsController } from './media-assets.controller';
import { MediaAssetsService } from './media-assets.service';

describe('MediaAssetsController', () => {
  let controller: MediaAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaAssetsController],
      providers: [MediaAssetsService],
    }).compile();

    controller = module.get<MediaAssetsController>(MediaAssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
