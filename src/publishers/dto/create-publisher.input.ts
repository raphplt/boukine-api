import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePublisherInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
