import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        launchOptions: {
          dropPendingUpdates: true,
        },
      }),
      inject: [ConfigService],
    }),
    CommandsModule,
  ],
  providers: [],
})
export class BotModule {}
