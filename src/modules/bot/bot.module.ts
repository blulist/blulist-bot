import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthMiddleware } from './shared/middlewares/auth.middleware';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SessionMiddleware } from './shared/middlewares/session.middleware';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        launchOptions: {
          dropPendingUpdates: true,
        },

        middlewares: [AuthMiddleware, SessionMiddleware],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PlaylistModule,
    TrackModule,
  ],
  providers: [],
})
export class BotModule {}
