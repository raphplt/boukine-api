import { CreateUserBookInput } from './create-user-book.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserBookInput extends PartialType(CreateUserBookInput) {
  @Field(() => Int)
  id: number;
}
