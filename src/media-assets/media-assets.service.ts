import { Injectable } from '@nestjs/common';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';

@Injectable()
export class MediaAssetsService {
  create(createMediaAssetDto: CreateMediaAssetDto) {
    return 'This action adds a new mediaAsset';
  }

  findAll() {
    return `This action returns all mediaAssets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mediaAsset`;
  }

  update(id: number, updateMediaAssetDto: UpdateMediaAssetDto) {
    return `This action updates a #${id} mediaAsset`;
  }

  remove(id: number) {
    return `This action removes a #${id} mediaAsset`;
  }
}
