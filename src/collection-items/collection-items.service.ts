import { Injectable } from '@nestjs/common';
import { CreateCollectionItemInput } from './dto/create-collection-item.input';
import { UpdateCollectionItemInput } from './dto/update-collection-item.input';

@Injectable()
export class CollectionItemsService {
  create(createCollectionItemInput: CreateCollectionItemInput) {
    return 'This action adds a new collectionItem';
  }

  findAll() {
    return `This action returns all collectionItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collectionItem`;
  }

  update(id: number, updateCollectionItemInput: UpdateCollectionItemInput) {
    return `This action updates a #${id} collectionItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} collectionItem`;
  }
}
