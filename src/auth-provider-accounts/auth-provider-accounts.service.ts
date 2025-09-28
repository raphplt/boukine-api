import { Injectable } from '@nestjs/common';
import { CreateAuthProviderAccountDto } from './dto/create-auth-provider-account.dto';
import { UpdateAuthProviderAccountDto } from './dto/update-auth-provider-account.dto';

@Injectable()
export class AuthProviderAccountsService {
  create(createAuthProviderAccountDto: CreateAuthProviderAccountDto) {
    return 'This action adds a new authProviderAccount';
  }

  findAll() {
    return `This action returns all authProviderAccounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authProviderAccount`;
  }

  update(
    id: number,
    updateAuthProviderAccountDto: UpdateAuthProviderAccountDto
  ) {
    return `This action updates a #${id} authProviderAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} authProviderAccount`;
  }
}
