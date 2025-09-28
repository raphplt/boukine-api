import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Publisher {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
