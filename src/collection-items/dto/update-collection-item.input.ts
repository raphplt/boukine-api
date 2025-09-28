import { CreateCollectionItemInput } from './create-collection-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCollectionItemInput extends PartialType(
  CreateCollectionItemInput
) {
  @Field(() => Int)
  id: number;
}
