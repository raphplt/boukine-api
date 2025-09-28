import { Test, TestingModule } from '@nestjs/testing';
import { DevicePushTokensService } from './device-push-tokens.service';

describe('DevicePushTokensService', () => {
  let service: DevicePushTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevicePushTokensService],
    }).compile();

    service = module.get<DevicePushTokensService>(DevicePushTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
