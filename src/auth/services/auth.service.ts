import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersService, SafeUser } from '../../users/users.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { LogoutDto } from '../dto/logout.dto';
import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';
import { MutexService } from './mutex.service';
import { RateLimitService } from './rate-limit.service';
import { Session } from '../entities/session.entity';
import { User } from '../../users/entities/user.entity';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

export interface RequestContextMeta {
  ip?: string | null;
  userAgent?: string | null;
}

export interface SessionView {
  id: string;
  deviceId: string;
  createdAt: Date;
  lastUsedAt: Date;
  ip: string | null;
  userAgent: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  rotatedFromSessionId: string | null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly mutexService: MutexService,
    private readonly rateLimitService: RateLimitService
  ) {}

  async register(dto: RegisterDto): Promise<SafeUser> {
    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.usersService.createWithPassword(
      dto.email,
      passwordHash
    );
    this.logger.log({ message: 'auth.register', userId: user.id });
    return this.usersService.toSafeUser(user);
  }

  async login(
    dto: LoginDto,
    context: RequestContextMeta
  ): Promise<LoginResult> {
    await this.rateLimitService.consume(
      `login:${dto.email.toLowerCase()}:${context.ip ?? 'unknown'}`
    );

    const user = await this.validateUser(dto.email, dto.password);

    await this.sessionService.revokeSessionsForDevice(user.id, dto.deviceId);

    const sessionId = randomUUID();
    const refreshToken = await this.tokenService.signRefreshToken(
      user.id,
      sessionId
    );
    const expiresAt = this.tokenService.getRefreshExpiryDate();

    await this.sessionService.createSession({
      sessionId,
      user,
      deviceId: dto.deviceId,
      refreshToken,
      ip: this.normalizeIp(context.ip),
      userAgent: this.normalizeUserAgent(context.userAgent),
      expiresAt
    });

    const accessToken = await this.tokenService.signAccessToken(
      user.id,
      sessionId
    );

    this.logger.log({
      message: 'auth.login.success',
      userId: user.id,
      sessionId,
      deviceId: dto.deviceId
    });

    return {
      accessToken,
      refreshToken,
      user: this.usersService.toSafeUser(user)
    };
  }

  async refresh(
    dto: RefreshDto,
    context: RequestContextMeta
  ): Promise<RefreshResult> {
    await this.rateLimitService.consume(
      `refresh:${dto.deviceId}:${context.ip ?? 'unknown'}`
    );

    const payload = await this.tokenService.verifyRefreshToken(
      dto.refreshToken
    );

    return this.mutexService.runExclusive(payload.jti, async () => {
      const session = await this.sessionService.findByIdWithUser(payload.jti);
      if (!session || !session.user) {
        throw new UnauthorizedException('Session not found');
      }

      this.ensureSessionOwnership(session, payload.sub);

      if (session.deviceId !== dto.deviceId) {
        await this.sessionService.revokeSession(session);
        throw new UnauthorizedException('Device identifier mismatch');
      }

      if (session.revokedAt) {
        throw new UnauthorizedException('Session revoked');
      }

      if (this.sessionService.isExpired(session)) {
        await this.sessionService.revokeSession(session);
        throw new UnauthorizedException('Session expired');
      }

      const isValid = await this.passwordService.verify(
        session.refreshTokenHash ?? '',
        dto.refreshToken
      );

      if (!isValid) {
        await this.sessionService.revokeSession(session);
        this.logger.warn({
          message: 'auth.refresh.reuse_detected',
          userId: session.userId,
          sessionId: session.id
        });
        throw new UnauthorizedException('Refresh token reuse detected');
      }

      const newSessionId = randomUUID();
      const newRefreshToken = await this.tokenService.signRefreshToken(
        session.userId,
        newSessionId
      );
      const expiresAt = this.tokenService.getRefreshExpiryDate();

      const newSession = await this.sessionService.rotateSession(session, {
        sessionId: newSessionId,
        refreshToken: newRefreshToken,
        expiresAt,
        ip: this.normalizeIp(context.ip),
        userAgent: this.normalizeUserAgent(context.userAgent),
        deviceId: session.deviceId
      });

      const accessToken = await this.tokenService.signAccessToken(
        newSession.userId,
        newSession.id
      );

      this.logger.log({
        message: 'auth.refresh.rotated',
        userId: newSession.userId,
        sessionId: newSession.id,
        rotatedFrom: session.id
      });

      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    });
  }

  async logout(userId: string, dto: LogoutDto): Promise<void> {
    await this.sessionService.revokeSessionsForDevice(userId, dto.deviceId);
    this.logger.log({ message: 'auth.logout', userId, deviceId: dto.deviceId });
  }

  async listSessions(userId: string): Promise<SessionView[]> {
    const sessions = await this.sessionService.listUserSessions(userId);
    return sessions.map((session) => this.toSessionView(session));
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.sessionService.revokeSessionById(userId, sessionId);
    this.logger.log({ message: 'auth.session.revoked', userId, sessionId });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordService.verify(
      user.passwordHash ?? '',
      password
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private ensureSessionOwnership(session: Session, userId: string): void {
    if (session.userId !== userId) {
      throw new UnauthorizedException('Session does not belong to user');
    }
  }

  private toSessionView(session: Session): SessionView {
    return {
      id: session.id,
      deviceId: session.deviceId,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      ip: session.ip,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      rotatedFromSessionId: session.rotatedFromSessionId
    };
  }

  private normalizeIp(ip?: string | null): string | null {
    if (!ip) {
      return null;
    }
    return ip.slice(0, 255);
  }

  private normalizeUserAgent(userAgent?: string | null): string | null {
    if (!userAgent) {
      return null;
    }
    return userAgent.slice(0, 512);
  }
}
