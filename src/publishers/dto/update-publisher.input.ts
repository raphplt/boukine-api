import { CreatePublisherInput } from './create-publisher.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePublisherInput extends PartialType(CreatePublisherInput) {
  @Field(() => Int)
  id: number;
}
