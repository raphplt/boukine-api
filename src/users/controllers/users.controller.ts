import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { AccessJwt } from '../../common/types/jwt-payloads';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the authenticated user profile' })
  @ApiOkResponse({ description: 'Current user profile' })
  async getMe(@CurrentUser() user: AccessJwt) {
    const entity = await this.usersService.findById(user.sub);
    if (!entity) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.toSafeUser(entity);
  }
}
