import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProviderAccountsService } from './auth-provider-accounts.service';
import { AuthProviderAccountsController } from './auth-provider-accounts.controller';
import { AuthProviderAccount } from './entities/auth-provider-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthProviderAccount])],
  controllers: [AuthProviderAccountsController],
  providers: [AuthProviderAccountsService],
  exports: [AuthProviderAccountsService]
})
export class AuthProviderAccountsModule {}
