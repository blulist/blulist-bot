import { Module } from '@nestjs/common';
import { BotModule } from './modules/bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
