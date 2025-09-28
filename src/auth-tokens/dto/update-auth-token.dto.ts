import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthTokenDto } from './create-auth-token.dto';

export class UpdateAuthTokenDto extends PartialType(CreateAuthTokenDto) {}
