import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Series {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
