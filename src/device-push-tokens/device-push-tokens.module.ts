import { Module } from '@nestjs/common';
import { DevicePushTokensService } from './device-push-tokens.service';
import { DevicePushTokensController } from './device-push-tokens.controller';

@Module({
  controllers: [DevicePushTokensController],
  providers: [DevicePushTokensService]
})
export class DevicePushTokensModule {}
