import { Module } from '@nestjs/common';
import { BotModule } from './modules/bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    BotModule,
    PrismaModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
