import { INestApplication, Injectable, NotFoundException, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as request from 'supertest';
import { AuthController } from '../src/auth/controllers/auth.controller';
import { AuthService, SessionView } from '../src/auth/services/auth.service';
import { MutexService } from '../src/auth/services/mutex.service';
import { PasswordService } from '../src/auth/services/password.service';
import { RateLimitService } from '../src/auth/services/rate-limit.service';
import { CreateSessionOptions, SessionService } from '../src/auth/services/session.service';
import { TokenService } from '../src/auth/services/token.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { JwtAccessStrategy } from '../src/auth/strategies/jwt-access.strategy';
import { UsersController } from '../src/users/controllers/users.controller';
import { UsersService, SafeUser } from '../src/users/users.service';
import { Session } from '../src/auth/entities/session.entity';
import { User } from '../src/users/entities/user.entity';

@Injectable()
class InMemoryUsersService {
  private users: User[] = [];

  async create(): Promise<User> {
    throw new Error('Method not implemented');
  }

  async createWithPassword(email: string, passwordHash: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.users.some((existing) => existing.email === normalizedEmail)) {
      throw new Error('Email already registered');
    }

    const now = new Date();
    const user: User = {
      id: `user-${this.users.length + 1}`,
      email: normalizedEmail,
      passwordHash,
      emailVerified: null,
      displayName: null,
      avatarUrl: null,
      locale: 'fr',
      privacyLevel: 'public',
      createdAt: now,
      updatedAt: now,
      authProviderAccounts: [],
      sessions: [],
      authTokens: [],
      following: [],
      followers: [],
      collections: [],
      userBooks: [],
      reviews: [],
      reactions: [],
      scanJobs: [],
      importJobs: [],
      exportJobs: [],
      notifications: [],
      devicePushTokens: [],
      mediaAssets: []
    };

    this.users.push(user);
    return user;
  }

  findAll(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }

  findOne(): Promise<User | null> {
    throw new Error('Method not implemented');
  }

  async update(): Promise<User> {
    throw new Error('Method not implemented');
  }

  async remove(): Promise<void> {
    throw new Error('Method not implemented');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email.trim().toLowerCase()) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    };
  }
}

interface StoredSession extends Session {
  refreshTokenHash: string | null;
}

@Injectable()
class InMemorySessionService {
  private readonly sessions = new Map<string, StoredSession>();

  constructor(private readonly passwordService: PasswordService) {}

  private clone(session: StoredSession): Session {
    return { ...session };
  }

  async createSession(options: CreateSessionOptions): Promise<Session> {
    const now = new Date();
    const id = options.sessionId ?? `session-${this.sessions.size + 1}`;
    const session: StoredSession = {
      id,
      userId: options.user.id,
      user: options.user,
      deviceId: options.deviceId,
      refreshTokenHash: await this.passwordService.hash(options.refreshToken),
      ip: options.ip ?? null,
      userAgent: options.userAgent ?? null,
      lastUsedAt: now,
      createdAt: now,
      updatedAt: now,
      expiresAt: options.expiresAt,
      revokedAt: null,
      rotatedFromSessionId: options.rotatedFromSessionId ?? null
    };

    this.sessions.set(id, session);
    return this.clone(session);
  }

  async rotateSession(previousSession: Session, options: Omit<CreateSessionOptions, 'user'>): Promise<Session> {
    const stored = this.sessions.get(previousSession.id);
    if (!stored) {
      throw new Error('Session not found');
    }

    const newSession = await this.createSession({
      ...options,
      user: stored.user,
      deviceId: options.deviceId ?? stored.deviceId,
      rotatedFromSessionId: stored.id
    });

    await this.revokeSession(stored);
    return newSession;
  }

  async revokeSession(session: Session | StoredSession): Promise<void> {
    const stored = this.sessions.get(session.id);
    if (!stored) {
      return;
    }
    if (!stored.revokedAt) {
      stored.revokedAt = new Date();
    }
    stored.refreshTokenHash = null;
    stored.updatedAt = new Date();
  }

  async revokeSessionById(userId: string, sessionId: string): Promise<void> {
    const stored = this.sessions.get(sessionId);
    if (!stored || stored.userId !== userId) {
      throw new NotFoundException('Session not found');
    }
    await this.revokeSession(stored);
  }

  async revokeSessionsForDevice(userId: string, deviceId: string): Promise<void> {
    await Promise.all(
      [...this.sessions.values()]
        .filter((session) => session.userId === userId && session.deviceId === deviceId && !session.revokedAt)
        .map((session) => this.revokeSession(session))
    );
  }

  async touchSession(sessionId: string): Promise<void> {
    const stored = this.sessions.get(sessionId);
    if (stored) {
      stored.lastUsedAt = new Date();
      stored.updatedAt = new Date();
    }
  }

  async listUserSessions(userId: string): Promise<Session[]> {
    return [...this.sessions.values()]
      .filter((session) => session.userId === userId)
      .sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime())
      .map((session) => this.clone(session));
  }

  async findById(sessionId: string): Promise<Session | null> {
    const stored = this.sessions.get(sessionId);
    return stored ? this.clone(stored) : null;
  }

  async findByIdWithUser(sessionId: string): Promise<Session | null> {
    const stored = this.sessions.get(sessionId);
    return stored ? this.clone(stored) : null;
  }

  async findActiveSessionByDevice(userId: string, deviceId: string): Promise<Session | null> {
    const stored = [...this.sessions.values()].find(
      (session) =>
        session.userId === userId &&
        session.deviceId === deviceId &&
        !session.revokedAt &&
        !this.isExpired(session)
    );
    return stored ? this.clone(stored) : null;
  }

  isExpired(session: Session): boolean {
    return session.expiresAt.getTime() <= Date.now();
  }
}

describe('Auth flows (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_ACCESS_TTL = '10m';
    process.env.JWT_REFRESH_TTL = '21d';
    process.env.RATE_LIMIT_MAX = '100';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        PassportModule.register({ defaultStrategy: 'jwt-access' }),
        JwtModule.register({})
      ],
      controllers: [AuthController, UsersController],
      providers: [
        AuthService,
        PasswordService,
        TokenService,
        MutexService,
        RateLimitService,
        JwtAccessStrategy,
        JwtAuthGuard,
        { provide: UsersService, useClass: InMemoryUsersService },
        { provide: SessionService, useClass: InMemorySessionService }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('registers, logs in, refreshes, and logs out successfully', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'VeryStr0ng!' })
      .expect(201);

    expect(registerResponse.body).toMatchObject({ email: 'test@example.com' });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'VeryStr0ng!', deviceId: 'device-a' })
      .expect(200);

    let accessToken = loginResponse.body.accessToken as string;
    let refreshToken = loginResponse.body.refreshToken as string;

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ email: 'test@example.com' });
      });

    const refreshResponse = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken, deviceId: 'device-a' })
      .expect(200);

    accessToken = refreshResponse.body.accessToken;
    refreshToken = refreshResponse.body.refreshToken;

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ deviceId: 'device-a' })
      .expect(204);

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken, deviceId: 'device-a' })
      .expect(401);
  });

  it('detects refresh token reuse after rotation', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'reuse@example.com', password: 'Reuse123!' })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'reuse@example.com', password: 'Reuse123!', deviceId: 'device-r' })
      .expect(200);

    const initialRefreshToken = loginResponse.body.refreshToken as string;

    const rotationResponse = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: initialRefreshToken, deviceId: 'device-r' })
      .expect(200);

    const rotatedRefreshToken = rotationResponse.body.refreshToken as string;

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: initialRefreshToken, deviceId: 'device-r' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: rotatedRefreshToken, deviceId: 'device-r' })
      .expect(200);
  });

  it('supports multiple devices and revocation per session', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'multi@example.com', password: 'Multi123!' })
      .expect(201);

    const loginA = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'multi@example.com', password: 'Multi123!', deviceId: 'device-a' })
      .expect(200);

    const loginB = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'multi@example.com', password: 'Multi123!', deviceId: 'device-b' })
      .expect(200);

    const accessTokenA = loginA.body.accessToken as string;
    const refreshTokenA = loginA.body.refreshToken as string;
    const refreshTokenB = loginB.body.refreshToken as string;

    const sessionsResponse = await request(app.getHttpServer())
      .get('/auth/sessions')
      .set('Authorization', `Bearer ${accessTokenA}`)
      .expect(200);

    expect(Array.isArray(sessionsResponse.body)).toBe(true);
    expect(sessionsResponse.body).toHaveLength(2);

    const sessionToRevoke = (sessionsResponse.body as SessionView[]).find(
      (session) => session.deviceId === 'device-b'
    );

    expect(sessionToRevoke).toBeDefined();

    await request(app.getHttpServer())
      .delete(`/auth/sessions/${sessionToRevoke!.id}`)
      .set('Authorization', `Bearer ${accessTokenA}`)
      .expect(204);

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: refreshTokenB, deviceId: 'device-b' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: refreshTokenA, deviceId: 'device-a' })
      .expect(200);
  });
});
