import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';

const configValues: Record<string, string> = {
  JWT_ACCESS_SECRET: 'test-access-secret',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
  JWT_ACCESS_TTL: '10m',
  JWT_REFRESH_TTL: '21d'
};

const createConfigService = (): ConfigService =>
  ({
    get: jest.fn((key: string, defaultValue?: unknown) => {
      return (
        (configValues[key] as string | undefined) ??
        (defaultValue as string | undefined)
      );
    }),
    getOrThrow: jest.fn((key: string) => {
      const value = configValues[key];
      if (!value) {
        throw new Error(`Missing config value for ${key}`);
      }
      return value;
    })
  }) as unknown as ConfigService;

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    const jwtService = new JwtService();
    tokenService = new TokenService(jwtService, createConfigService());
  });

  it('signs and verifies access tokens', async () => {
    const token = await tokenService.signAccessToken('user-1', 'session-1');
    const payload = await tokenService.verifyAccessToken(token);

    expect(payload.sub).toBe('user-1');
    expect(payload.sid).toBe('session-1');
  });

  it('signs and verifies refresh tokens', async () => {
    const token = await tokenService.signRefreshToken('user-2', 'session-2');
    const payload = await tokenService.verifyRefreshToken(token);

    expect(payload.sub).toBe('user-2');
    expect(payload.jti).toBe('session-2');
  });

  it('computes refresh expiry date using configured TTL', () => {
    const expiresAt = tokenService.getRefreshExpiryDate();
    const now = Date.now();

    expect(expiresAt.getTime()).toBeGreaterThan(now);
    // 21 days in ms = 1814400000
    expect(expiresAt.getTime()).toBeLessThanOrEqual(
      now + 21 * 24 * 60 * 60 * 1000 + 1000
    );
  });
});
