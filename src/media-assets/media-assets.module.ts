import { Module } from '@nestjs/common';
import { MediaAssetsService } from './media-assets.service';
import { MediaAssetsController } from './media-assets.controller';

@Module({
  controllers: [MediaAssetsController],
  providers: [MediaAssetsService],
})
export class MediaAssetsModule {}
