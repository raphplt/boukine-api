import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorksService } from './works.service';
import { BookWork } from './entities/work.entity';
import { CreateWorkInput } from './dto/create-work.input';
import { UpdateWorkInput } from './dto/update-work.input';

@Resolver(() => BookWork)
export class WorksResolver {
  constructor(private readonly worksService: WorksService) {}

  @Mutation(() => BookWork)
  createWork(@Args('createWorkInput') createWorkInput: CreateWorkInput) {
    return this.worksService.create(createWorkInput);
  }

  @Query(() => [BookWork], { name: 'works' })
  findAll() {
    return this.worksService.findAll();
  }

  @Query(() => BookWork, { name: 'work' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.worksService.findOne(id);
  }

  @Mutation(() => BookWork)
  updateWork(@Args('updateWorkInput') updateWorkInput: UpdateWorkInput) {
    return this.worksService.update(updateWorkInput.id, updateWorkInput);
  }

  @Mutation(() => BookWork)
  removeWork(@Args('id', { type: () => String }) id: string) {
    return this.worksService.remove(id);
  }
}
