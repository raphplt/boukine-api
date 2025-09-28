import { Test, TestingModule } from '@nestjs/testing';
import { AuthTokensController } from './auth-tokens.controller';
import { AuthTokensService } from './auth-tokens.service';

describe('AuthTokensController', () => {
  let controller: AuthTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthTokensController],
      providers: [AuthTokensService]
    }).compile();

    controller = module.get<AuthTokensController>(AuthTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
