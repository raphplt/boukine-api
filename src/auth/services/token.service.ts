import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessJwt, RefreshJwt } from '../../common/types/jwt-payloads';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signAccessToken(userId: string, sessionId: string): Promise<string> {
    const payload: AccessJwt = { sub: userId, sid: sessionId };
    return this.jwtService.signAsync(payload, {
      secret: this.getAccessSecret(),
      expiresIn: this.getAccessTtl()
    });
  }

  async signRefreshToken(userId: string, sessionId: string): Promise<string> {
    const payload: RefreshJwt = { sub: userId, jti: sessionId };
    return this.jwtService.signAsync(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: this.getRefreshTtl()
    });
  }

  async verifyAccessToken(token: string): Promise<AccessJwt> {
    try {
      return await this.jwtService.verifyAsync<AccessJwt>(token, {
        secret: this.getAccessSecret()
      });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshJwt> {
    try {
      return await this.jwtService.verifyAsync<RefreshJwt>(token, {
        secret: this.getRefreshSecret()
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getRefreshExpiryDate(): Date {
    const ttlMs = this.parseDurationToMs(this.getRefreshTtl());
    return new Date(Date.now() + ttlMs);
  }

  private getAccessSecret(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
  }

  private getRefreshSecret(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  private getAccessTtl(): string {
    return this.configService.get<string>('JWT_ACCESS_TTL', '10m');
  }

  private getRefreshTtl(): string {
    return this.configService.get<string>('JWT_REFRESH_TTL', '21d');
  }

  private parseDurationToMs(value: string): number {
    const trimmed = value.trim();
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric)) {
      return numeric * 1000;
    }

    const match = trimmed.match(/^(\d+)([smhdw])$/i);
    if (!match) {
      throw new Error(`Unsupported duration format: ${value}`);
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const unitToMs: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000
    };

    return amount * unitToMs[unit];
  }
}
