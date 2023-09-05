import { Injectable, Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  imports: [],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [],
})
export class TelegramModule {}
