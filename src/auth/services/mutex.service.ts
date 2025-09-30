import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';

@Injectable()
export class MutexService implements OnModuleDestroy {
  private readonly logger = new Logger(MutexService.name);
  private readonly inMemoryLocks = new Map<string, Promise<unknown>>();
  private readonly redis?: Redis;
  private readonly lockTtlMs = 5000;
  private readonly maxWaitMs = 2000;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true
      });
      this.redis.on('error', (error) => {
        this.logger.error(`Redis connection error: ${error.message}`);
      });
      void this.redis.connect().catch((error) => {
        this.logger.error(`Failed to connect to Redis: ${error.message}`);
      });
    }
  }

  async runExclusive<T>(key: string, task: () => Promise<T>): Promise<T> {
    if (this.redis) {
      return this.runWithRedisLock(key, task);
    }
    return this.runWithInMemoryLock(key, task);
  }

  private async runWithInMemoryLock<T>(
    key: string,
    task: () => Promise<T>
  ): Promise<T> {
    const previous = this.inMemoryLocks.get(key) ?? Promise.resolve();
    let release: (() => void) | undefined;

    const current = (async () => {
      await previous;
      return task();
    })();

    release = () => {
      if (this.inMemoryLocks.get(key) === current) {
        this.inMemoryLocks.delete(key);
      }
    };

    this.inMemoryLocks.set(
      key,
      current.then(() => undefined).catch(() => undefined)
    );

    try {
      return await current;
    } finally {
      release();
    }
  }

  private async runWithRedisLock<T>(
    key: string,
    task: () => Promise<T>
  ): Promise<T> {
    const lockKey = `auth:mutex:${key}`;
    const lockId = randomUUID();
    const startedAt = Date.now();

    while (Date.now() - startedAt < this.maxWaitMs) {
      const acquired = await this.redis!.set(
        lockKey,
        lockId,
        'PX',
        this.lockTtlMs,
        'NX'
      );
      if (acquired === 'OK') {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    const currentValue = await this.redis!.get(lockKey);
    if (currentValue !== lockId) {
      this.logger.warn(
        `Failed to acquire redis lock for key ${key}, falling back to in-memory lock`
      );
      return this.runWithInMemoryLock(key, task);
    }

    try {
      return await task();
    } finally {
      await this.releaseRedisLock(lockKey, lockId);
    }
  }

  private async releaseRedisLock(
    lockKey: string,
    lockId: string
  ): Promise<void> {
    const releaseScript =
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
    try {
      await this.redis!.eval(releaseScript, 1, lockKey, lockId);
    } catch (error) {
      this.logger.error(
        `Failed to release redis lock for ${lockKey}: ${(error as Error).message}`
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
