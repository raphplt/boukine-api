import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserBook {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
