import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthProviderAccountDto } from './create-auth-provider-account.dto';

export class UpdateAuthProviderAccountDto extends PartialType(CreateAuthProviderAccountDto) {}
