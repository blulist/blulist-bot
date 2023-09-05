import { Module } from '@nestjs/common';
import { BotModule } from './modules/bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { LoggingModule } from './modules/logging/logging.module';
import { DiscordLogger } from './modules/logging/loggers/discord.logger';
import { TelegramModule } from './modules/http/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    BotModule,
    PrismaModule,
    RedisModule,
    LoggingModule.register(new DiscordLogger()),
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
