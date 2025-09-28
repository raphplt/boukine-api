import { Module } from '@nestjs/common';
import { AuthProviderAccountsService } from './auth-provider-accounts.service';
import { AuthProviderAccountsController } from './auth-provider-accounts.controller';

@Module({
  controllers: [AuthProviderAccountsController],
  providers: [AuthProviderAccountsService],
})
export class AuthProviderAccountsModule {}
