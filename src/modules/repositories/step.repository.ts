import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class StepRepository {
  constructor(private redis: RedisService) {}

  async set(
    userId: string,
    step: string,
    time: number | null = null,
  ): Promise<void> {
    if (time) {
      await this.redis.setex(`STEP_${userId}`, time, step);
    } else {
      await this.redis.set(`STEP_${userId}`, step);
    }
  }

  async delete(userId: string): Promise<void> {
    await this.redis.del(`STEP_${userId}`);
  }

  async has(userId: string): Promise<boolean> {
    const data = await this.redis.get(`STEP_${userId}`);
    return !!data;
  }
}
