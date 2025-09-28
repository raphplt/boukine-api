import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EditionsService } from './editions.service';
import { Edition } from './entities/edition.entity';
import { CreateEditionInput } from './dto/create-edition.input';
import { UpdateEditionInput } from './dto/update-edition.input';

@Resolver(() => Edition)
export class EditionsResolver {
  constructor(private readonly editionsService: EditionsService) {}

  @Mutation(() => Edition)
  createEdition(
    @Args('createEditionInput') createEditionInput: CreateEditionInput
  ) {
    return this.editionsService.create(createEditionInput);
  }

  @Query(() => [Edition], { name: 'editions' })
  findAll() {
    return this.editionsService.findAll();
  }

  @Query(() => Edition, { name: 'edition' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.editionsService.findOne(id);
  }

  @Mutation(() => Edition)
  updateEdition(
    @Args('updateEditionInput') updateEditionInput: UpdateEditionInput
  ) {
    return this.editionsService.update(
      updateEditionInput.id,
      updateEditionInput
    );
  }

  @Mutation(() => Edition)
  removeEdition(@Args('id', { type: () => Int }) id: number) {
    return this.editionsService.remove(id);
  }
}
