import { Test, TestingModule } from '@nestjs/testing';
import { AuthProviderAccountsService } from './auth-provider-accounts.service';

describe('AuthProviderAccountsService', () => {
  let service: AuthProviderAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthProviderAccountsService],
    }).compile();

    service = module.get<AuthProviderAccountsService>(AuthProviderAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
