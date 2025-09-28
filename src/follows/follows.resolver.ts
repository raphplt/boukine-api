import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FollowsService } from './follows.service';
import { UserFollow } from './entities/follow.entity';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';

@Resolver(() => UserFollow)
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Mutation(() => UserFollow)
  createFollow(
    @Args('createFollowInput') createFollowInput: CreateFollowInput
  ) {
    return this.followsService.create(createFollowInput);
  }

  @Query(() => [UserFollow], { name: 'follows' })
  findAll() {
    return this.followsService.findAll();
  }

  @Query(() => UserFollow, { name: 'follow' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.followsService.findOne(id);
  }

  @Mutation(() => UserFollow)
  updateFollow(
    @Args('updateFollowInput') updateFollowInput: UpdateFollowInput
  ) {
    return this.followsService.update(updateFollowInput.id, updateFollowInput);
  }

  @Mutation(() => UserFollow)
  removeFollow(@Args('id', { type: () => String }) id: string) {
    return this.followsService.remove(id);
  }
}
