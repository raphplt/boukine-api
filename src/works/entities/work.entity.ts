import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Work {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
