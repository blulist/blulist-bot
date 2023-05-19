import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommandsModule } from './commands/commands.module';
import { EventsModule } from './events/events.module';
import { AuthMiddleware } from './shared/middlewares/auth.middleware';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        launchOptions: {
          dropPendingUpdates: true,
        },

        middlewares: [AuthMiddleware],
      }),
      inject: [ConfigService],
    }),
    CommandsModule,
    EventsModule,
  ],
  providers: [],
})
export class BotModule { }
