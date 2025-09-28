import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorksService } from './works.service';
import { Work } from './entities/work.entity';
import { CreateWorkInput } from './dto/create-work.input';
import { UpdateWorkInput } from './dto/update-work.input';

@Resolver(() => Work)
export class WorksResolver {
  constructor(private readonly worksService: WorksService) {}

  @Mutation(() => Work)
  createWork(@Args('createWorkInput') createWorkInput: CreateWorkInput) {
    return this.worksService.create(createWorkInput);
  }

  @Query(() => [Work], { name: 'works' })
  findAll() {
    return this.worksService.findAll();
  }

  @Query(() => Work, { name: 'work' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.worksService.findOne(id);
  }

  @Mutation(() => Work)
  updateWork(@Args('updateWorkInput') updateWorkInput: UpdateWorkInput) {
    return this.worksService.update(updateWorkInput.id, updateWorkInput);
  }

  @Mutation(() => Work)
  removeWork(@Args('id', { type: () => Int }) id: number) {
    return this.worksService.remove(id);
  }
}
