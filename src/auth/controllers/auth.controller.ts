import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Request } from 'express';
import {
  AuthService,
  LoginResult,
  RefreshResult,
  RequestContextMeta,
  SessionView
} from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { LogoutDto } from '../dto/logout.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AccessJwt } from '../../common/types/jwt-payloads';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate using email/password and create a session'
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Authenticated successfully' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request
  ): Promise<LoginResult> {
    return this.authService.login(dto, this.extractContext(req));
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({ description: 'Tokens refreshed successfully' })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request
  ): Promise<RefreshResult> {
    return this.authService.refresh(dto, this.extractContext(req));
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke the current device session' })
  async logout(
    @Body() dto: LogoutDto,
    @CurrentUser() user: AccessJwt
  ): Promise<void> {
    await this.authService.logout(user.sub, dto);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List active and historical sessions for the current user'
  })
  @ApiOkResponse({ description: 'List of sessions returned' })
  async listSessions(@CurrentUser() user: AccessJwt): Promise<SessionView[]> {
    return this.authService.listSessions(user.sub);
  }

  @Delete('sessions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke a specific session by identifier' })
  async revokeSession(
    @CurrentUser() user: AccessJwt,
    @Param('id', new ParseUUIDPipe()) sessionId: string
  ): Promise<void> {
    await this.authService.revokeSession(user.sub, sessionId);
  }

  private extractContext(req: Request): RequestContextMeta {
    return {
      ip: this.resolveIp(req),
      userAgent: req.headers['user-agent'] ?? null
    };
  }

  private resolveIp(req: Request): string | null {
    const headerIp = (req.headers['x-forwarded-for'] as string | undefined)
      ?.split(',')[0]
      ?.trim();
    return headerIp || req.ip || req.socket.remoteAddress || null;
  }
}
