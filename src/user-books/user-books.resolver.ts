import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserBooksService } from './user-books.service';
import { UserBook } from './entities/user-book.entity';
import { CreateUserBookInput } from './dto/create-user-book.input';
import { UpdateUserBookInput } from './dto/update-user-book.input';

@Resolver(() => UserBook)
export class UserBooksResolver {
  constructor(private readonly userBooksService: UserBooksService) {}

  @Mutation(() => UserBook)
  createUserBook(@Args('createUserBookInput') createUserBookInput: CreateUserBookInput) {
    return this.userBooksService.create(createUserBookInput);
  }

  @Query(() => [UserBook], { name: 'userBooks' })
  findAll() {
    return this.userBooksService.findAll();
  }

  @Query(() => UserBook, { name: 'userBook' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userBooksService.findOne(id);
  }

  @Mutation(() => UserBook)
  updateUserBook(@Args('updateUserBookInput') updateUserBookInput: UpdateUserBookInput) {
    return this.userBooksService.update(updateUserBookInput.id, updateUserBookInput);
  }

  @Mutation(() => UserBook)
  removeUserBook(@Args('id', { type: () => Int }) id: number) {
    return this.userBooksService.remove(id);
  }
}
