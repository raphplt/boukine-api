import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateReactionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
