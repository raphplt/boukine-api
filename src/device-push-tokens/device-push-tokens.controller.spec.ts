import { Test, TestingModule } from '@nestjs/testing';
import { DevicePushTokensController } from './device-push-tokens.controller';
import { DevicePushTokensService } from './device-push-tokens.service';

describe('DevicePushTokensController', () => {
  let controller: DevicePushTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicePushTokensController],
      providers: [DevicePushTokensService]
    }).compile();

    controller = module.get<DevicePushTokensController>(
      DevicePushTokensController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
