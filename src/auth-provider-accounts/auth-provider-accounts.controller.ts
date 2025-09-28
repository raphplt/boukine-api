import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthProviderAccountsService } from './auth-provider-accounts.service';
import { CreateAuthProviderAccountDto } from './dto/create-auth-provider-account.dto';
import { UpdateAuthProviderAccountDto } from './dto/update-auth-provider-account.dto';

@Controller('auth-provider-accounts')
export class AuthProviderAccountsController {
  constructor(private readonly authProviderAccountsService: AuthProviderAccountsService) {}

  @Post()
  create(@Body() createAuthProviderAccountDto: CreateAuthProviderAccountDto) {
    return this.authProviderAccountsService.create(createAuthProviderAccountDto);
  }

  @Get()
  findAll() {
    return this.authProviderAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authProviderAccountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthProviderAccountDto: UpdateAuthProviderAccountDto) {
    return this.authProviderAccountsService.update(+id, updateAuthProviderAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authProviderAccountsService.remove(+id);
  }
}
