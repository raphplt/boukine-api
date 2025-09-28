import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevicePushTokensService } from './device-push-tokens.service';
import { CreateDevicePushTokenDto } from './dto/create-device-push-token.dto';
import { UpdateDevicePushTokenDto } from './dto/update-device-push-token.dto';

@Controller('device-push-tokens')
export class DevicePushTokensController {
  constructor(private readonly devicePushTokensService: DevicePushTokensService) {}

  @Post()
  create(@Body() createDevicePushTokenDto: CreateDevicePushTokenDto) {
    return this.devicePushTokensService.create(createDevicePushTokenDto);
  }

  @Get()
  findAll() {
    return this.devicePushTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicePushTokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevicePushTokenDto: UpdateDevicePushTokenDto) {
    return this.devicePushTokensService.update(+id, updateDevicePushTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devicePushTokensService.remove(+id);
  }
}
