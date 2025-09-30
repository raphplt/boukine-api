import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { randomUUID } from 'crypto';
import { Session } from '../entities/session.entity';
import { User } from '../../users/entities/user.entity';
import { PasswordService } from './password.service';

export interface CreateSessionOptions {
  user: User;
  deviceId: string;
  refreshToken: string;
  ip?: string | null;
  userAgent?: string | null;
  expiresAt: Date;
  rotatedFromSessionId?: string | null;
  sessionId?: string;
}

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly passwordService: PasswordService
  ) {}

  async createSession(options: CreateSessionOptions): Promise<Session> {
    const now = new Date();
    const session = this.sessionRepository.create({
      id: options.sessionId ?? randomUUID(),
      user: options.user,
      userId: options.user.id,
      deviceId: options.deviceId,
      refreshTokenHash: await this.passwordService.hash(options.refreshToken),
      ip: options.ip ?? null,
      userAgent: options.userAgent ?? null,
      lastUsedAt: now,
      expiresAt: options.expiresAt,
      rotatedFromSessionId: options.rotatedFromSessionId ?? null,
      revokedAt: null
    });

    return this.sessionRepository.save(session);
  }

  async rotateSession(
    previousSession: Session,
    options: Omit<CreateSessionOptions, 'user'>
  ): Promise<Session> {
    const user =
      previousSession.user ?? ({ id: previousSession.userId } as User);
    const newSession = await this.createSession({
      ...options,
      user,
      deviceId: options.deviceId ?? previousSession.deviceId,
      ip: options.ip ?? previousSession.ip,
      userAgent: options.userAgent ?? previousSession.userAgent,
      rotatedFromSessionId: previousSession.id
    });

    await this.revokeSession(previousSession);

    return newSession;
  }

  async revokeSession(session: Session): Promise<void> {
    if (session.revokedAt) {
      return;
    }
    session.revokedAt = new Date();
    session.refreshTokenHash = null;
    await this.sessionRepository.save(session);
  }

  async revokeSessionById(userId: string, sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, userId }
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    await this.revokeSession(session);
  }

  async revokeSessionsForDevice(
    userId: string,
    deviceId: string
  ): Promise<void> {
    const sessions = await this.sessionRepository.find({
      where: {
        userId,
        deviceId,
        revokedAt: IsNull()
      }
    });

    await Promise.all(sessions.map((session) => this.revokeSession(session)));
  }

  async touchSession(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, {
      lastUsedAt: new Date()
    });
  }

  async listUserSessions(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId },
      order: { lastUsedAt: 'DESC' }
    });
  }

  async findById(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { id: sessionId } });
  }

  async findByIdWithUser(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: { user: true }
    });
  }

  async findActiveSessionByDevice(
    userId: string,
    deviceId: string
  ): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        userId,
        deviceId,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date())
      }
    });
  }

  isExpired(session: Session): boolean {
    return session.expiresAt.getTime() <= Date.now();
  }
}
