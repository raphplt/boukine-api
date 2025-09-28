import { CreateFollowInput } from './create-follow.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFollowInput extends PartialType(CreateFollowInput) {
  @Field()
  id: string;
}
