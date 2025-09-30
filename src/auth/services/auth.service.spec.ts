import { UnauthorizedException } from '@nestjs/common';
import { AuthService, RequestContextMeta } from './auth.service';
import { UsersService } from '../../users/users.service';
import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';
import { MutexService } from './mutex.service';
import { RateLimitService } from './rate-limit.service';

const createContext = (
  overrides: Partial<RequestContextMeta> = {}
): RequestContextMeta => ({
  ip: '127.0.0.1',
  userAgent: 'jest-test-agent',
  ...overrides
});

describe('AuthService', () => {
  let authService: AuthService;
  let usersServiceMock: any;
  let sessionServiceMock: any;
  let tokenServiceMock: any;
  let passwordServiceMock: any;
  let mutexServiceMock: any;
  let rateLimitServiceMock: any;

  const user = {
    id: 'user-1',
    email: 'user@example.com',
    passwordHash: 'hashed-password',
    displayName: null,
    avatarUrl: null
  };

  const session = {
    id: 'session-1',
    userId: 'user-1',
    deviceId: 'device-1',
    refreshTokenHash: 'refresh-hash',
    revokedAt: null,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    ip: null,
    userAgent: null,
    lastUsedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    rotatedFromSessionId: null,
    user
  };

  const safeUser = {
    id: user.id,
    email: user.email,
    displayName: null,
    avatarUrl: null
  };

  beforeEach(() => {
    usersServiceMock = {
      findByEmail: jest.fn(),
      createWithPassword: jest.fn(),
      toSafeUser: jest.fn(),
      findById: jest.fn()
    };

    sessionServiceMock = {
      revokeSessionsForDevice: jest.fn(),
      createSession: jest.fn(),
      findByIdWithUser: jest.fn(),
      rotateSession: jest.fn(),
      revokeSession: jest.fn(),
      listUserSessions: jest.fn(),
      revokeSessionById: jest.fn(),
      isExpired: jest.fn()
    };

    tokenServiceMock = {
      signAccessToken: jest.fn(),
      signRefreshToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      getRefreshExpiryDate: jest.fn()
    };

    passwordServiceMock = {
      hash: jest.fn(),
      verify: jest.fn()
    };

    mutexServiceMock = {
      runExclusive: jest.fn(
        async (_key: string, task: () => Promise<unknown>) => task()
      )
    };

    rateLimitServiceMock = {
      consume: jest.fn()
    };

    authService = new AuthService(
      usersServiceMock as UsersService,
      sessionServiceMock as SessionService,
      tokenServiceMock as TokenService,
      passwordServiceMock as PasswordService,
      mutexServiceMock as MutexService,
      rateLimitServiceMock as RateLimitService
    );
  });

  describe('login', () => {
    it('returns tokens and user data on successful login', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(user);
      passwordServiceMock.verify.mockResolvedValue(true);
      tokenServiceMock.signRefreshToken.mockResolvedValue('refresh-token');
      tokenServiceMock.signAccessToken.mockResolvedValue('access-token');
      tokenServiceMock.getRefreshExpiryDate.mockReturnValue(
        new Date(Date.now() + 1000)
      );
      sessionServiceMock.createSession.mockResolvedValue(session);
      usersServiceMock.toSafeUser.mockReturnValue(safeUser);

      const result = await authService.login(
        { email: user.email, password: 'P@ssw0rd!', deviceId: 'device-1' },
        createContext()
      );

      expect(rateLimitServiceMock.consume).toHaveBeenCalledWith(
        'login:user@example.com:127.0.0.1'
      );
      expect(sessionServiceMock.revokeSessionsForDevice).toHaveBeenCalledWith(
        user.id,
        'device-1'
      );
      expect(sessionServiceMock.createSession).toHaveBeenCalledWith(
        expect.objectContaining({
          user,
          deviceId: 'device-1',
          refreshToken: 'refresh-token'
        })
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: safeUser
      });
    });
  });

  describe('refresh', () => {
    it('rotates the session when refresh token is valid', async () => {
      tokenServiceMock.verifyRefreshToken.mockResolvedValue({
        sub: user.id,
        jti: session.id
      });
      sessionServiceMock.findByIdWithUser.mockResolvedValue(session);
      sessionServiceMock.isExpired.mockReturnValue(false);
      passwordServiceMock.verify.mockResolvedValue(true);
      tokenServiceMock.signRefreshToken.mockResolvedValue('new-refresh');
      tokenServiceMock.signAccessToken.mockResolvedValue('new-access');
      tokenServiceMock.getRefreshExpiryDate.mockReturnValue(
        new Date(Date.now() + 2000)
      );
      sessionServiceMock.rotateSession.mockResolvedValue({
        ...session,
        id: 'session-2',
        refreshTokenHash: 'new-hash',
        rotatedFromSessionId: session.id
      });

      const result = await authService.refresh(
        { refreshToken: 'refresh-token', deviceId: 'device-1' },
        createContext()
      );

      expect(rateLimitServiceMock.consume).toHaveBeenCalledWith(
        'refresh:device-1:127.0.0.1'
      );
      expect(sessionServiceMock.rotateSession).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'new-access',
        refreshToken: 'new-refresh'
      });
    });

    it('revokes session and throws when refresh token reuse is detected', async () => {
      tokenServiceMock.verifyRefreshToken.mockResolvedValue({
        sub: user.id,
        jti: session.id
      });
      sessionServiceMock.findByIdWithUser.mockResolvedValue(session);
      sessionServiceMock.isExpired.mockReturnValue(false);
      passwordServiceMock.verify.mockResolvedValue(false);

      await expect(
        authService.refresh(
          { refreshToken: 'invalid', deviceId: 'device-1' },
          createContext()
        )
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(sessionServiceMock.revokeSession).toHaveBeenCalledWith(session);
    });
  });

  describe('logout', () => {
    it('revokes all sessions for the device', async () => {
      await authService.logout(user.id, { deviceId: 'device-1' });

      expect(sessionServiceMock.revokeSessionsForDevice).toHaveBeenCalledWith(
        user.id,
        'device-1'
      );
    });
  });

  describe('register', () => {
    it('hashes password and creates a new user', async () => {
      passwordServiceMock.hash.mockResolvedValue('hashed-secret');
      usersServiceMock.createWithPassword.mockResolvedValue(user);
      usersServiceMock.toSafeUser.mockReturnValue(safeUser);

      const result = await authService.register({
        email: user.email,
        password: 'P@ssw0rd!'
      });

      expect(passwordServiceMock.hash).toHaveBeenCalledWith('P@ssw0rd!');
      expect(usersServiceMock.createWithPassword).toHaveBeenCalledWith(
        user.email,
        'hashed-secret'
      );
      expect(result).toEqual(safeUser);
    });
  });
});
