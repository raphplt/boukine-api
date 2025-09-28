import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCollectionItemInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
