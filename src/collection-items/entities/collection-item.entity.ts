import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CollectionItem {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
