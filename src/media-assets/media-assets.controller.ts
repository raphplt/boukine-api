import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { MediaAssetsService } from './media-assets.service';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';

@Controller('media-assets')
export class MediaAssetsController {
  constructor(private readonly mediaAssetsService: MediaAssetsService) {}

  @Post()
  create(@Body() createMediaAssetDto: CreateMediaAssetDto) {
    return this.mediaAssetsService.create(createMediaAssetDto);
  }

  @Get()
  findAll() {
    return this.mediaAssetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaAssetsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMediaAssetDto: UpdateMediaAssetDto
  ) {
    return this.mediaAssetsService.update(+id, updateMediaAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaAssetsService.remove(+id);
  }
}
