import { Test, TestingModule } from '@nestjs/testing';
import { AuthProviderAccountsController } from './auth-provider-accounts.controller';
import { AuthProviderAccountsService } from './auth-provider-accounts.service';

describe('AuthProviderAccountsController', () => {
  let controller: AuthProviderAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthProviderAccountsController],
      providers: [AuthProviderAccountsService]
    }).compile();

    controller = module.get<AuthProviderAccountsController>(
      AuthProviderAccountsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
