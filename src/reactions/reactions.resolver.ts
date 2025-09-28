import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReactionsService } from './reactions.service';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionInput } from './dto/create-reaction.input';
import { UpdateReactionInput } from './dto/update-reaction.input';

@Resolver(() => Reaction)
export class ReactionsResolver {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Mutation(() => Reaction)
  createReaction(
    @Args('createReactionInput') createReactionInput: CreateReactionInput
  ) {
    return this.reactionsService.create(createReactionInput);
  }

  @Query(() => [Reaction], { name: 'reactions' })
  findAll() {
    return this.reactionsService.findAll();
  }

  @Query(() => Reaction, { name: 'reaction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.reactionsService.findOne(id);
  }

  @Mutation(() => Reaction)
  updateReaction(
    @Args('updateReactionInput') updateReactionInput: UpdateReactionInput
  ) {
    return this.reactionsService.update(
      updateReactionInput.id,
      updateReactionInput
    );
  }

  @Mutation(() => Reaction)
  removeReaction(@Args('id', { type: () => Int }) id: number) {
    return this.reactionsService.remove(id);
  }
}
