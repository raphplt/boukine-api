import { Module } from '@nestjs/common';
import { AuthTokensService } from './auth-tokens.service';
import { AuthTokensController } from './auth-tokens.controller';

@Module({
  controllers: [AuthTokensController],
  providers: [AuthTokensService],
})
export class AuthTokensModule {}
