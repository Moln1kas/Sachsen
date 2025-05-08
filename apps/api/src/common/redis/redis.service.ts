import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.client = new Redis({
      host: configService.getOrThrow<string>('REDIS_HOST'),
      port: configService.getOrThrow<number>('REDIS_PORT'),
      password: configService.getOrThrow<string>('REDIS_PASSWORD'),
    });
  }

  async set(key: string, value: string, ...args: any[]) {
    await this.client.set(key, value, ...args);
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
