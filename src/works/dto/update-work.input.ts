import { CreateWorkInput } from './create-work.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWorkInput extends PartialType(CreateWorkInput) {
  @Field()
  id: string;
}
