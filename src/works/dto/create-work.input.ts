import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateWorkInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
