import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import {
  RateLimiterAbstract,
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes
} from 'rate-limiter-flexible';

@Injectable()
export class RateLimitService implements OnModuleDestroy {
  private readonly limiter: RateLimiterAbstract;
  private readonly redis?: Redis;

  constructor(private readonly configService: ConfigService) {
    const points = Number(configService.get('RATE_LIMIT_MAX', '60'));
    const windowMs = Number(configService.get('RATE_LIMIT_WINDOW_MS', '60000'));
    const durationSeconds = Math.max(1, Math.ceil(windowMs / 1000));

    const redisUrl = configService.get<string>('REDIS_URL');
    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true
      });
      this.limiter = new RateLimiterRedis({
        storeClient: this.redis,
        points,
        duration: durationSeconds
      });
    } else {
      this.limiter = new RateLimiterMemory({
        points,
        duration: durationSeconds
      });
    }
  }

  async consume(key: string): Promise<void> {
    try {
      await this.limiter.consume(key);
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        throw new HttpException(
          'Too many requests, please try again later.',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
