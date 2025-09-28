import { CreateEditionInput } from './create-edition.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEditionInput extends PartialType(CreateEditionInput) {
  @Field(() => Int)
  id: number;
}
