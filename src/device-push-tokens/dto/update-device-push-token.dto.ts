import { PartialType } from '@nestjs/mapped-types';
import { CreateDevicePushTokenDto } from './create-device-push-token.dto';

export class UpdateDevicePushTokenDto extends PartialType(
  CreateDevicePushTokenDto
) {}
