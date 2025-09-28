import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthTokensService } from './auth-tokens.service';
import { CreateAuthTokenDto } from './dto/create-auth-token.dto';
import { UpdateAuthTokenDto } from './dto/update-auth-token.dto';

@Controller('auth-tokens')
export class AuthTokensController {
  constructor(private readonly authTokensService: AuthTokensService) {}

  @Post()
  create(@Body() createAuthTokenDto: CreateAuthTokenDto) {
    return this.authTokensService.create(createAuthTokenDto);
  }

  @Get()
  findAll() {
    return this.authTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authTokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthTokenDto: UpdateAuthTokenDto) {
    return this.authTokensService.update(+id, updateAuthTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authTokensService.remove(+id);
  }
}
