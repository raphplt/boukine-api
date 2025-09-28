import { Injectable } from '@nestjs/common';
import { CreateDevicePushTokenDto } from './dto/create-device-push-token.dto';
import { UpdateDevicePushTokenDto } from './dto/update-device-push-token.dto';

@Injectable()
export class DevicePushTokensService {
  create(createDevicePushTokenDto: CreateDevicePushTokenDto) {
    return 'This action adds a new devicePushToken';
  }

  findAll() {
    return `This action returns all devicePushTokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} devicePushToken`;
  }

  update(id: number, updateDevicePushTokenDto: UpdateDevicePushTokenDto) {
    return `This action updates a #${id} devicePushToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} devicePushToken`;
  }
}
