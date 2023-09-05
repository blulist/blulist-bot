import { ArgumentsHost, Catch, ExecutionContext } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Context } from '../interfaces/context.interface';
import {
  TelegrafExceptionFilter,
  TelegrafArgumentsHost,
} from 'nestjs-telegraf';
import { mainMenuInlineKeyboards } from '../keyboards/main.keyboard';
import { LoggingService } from '../../../logging/logging.service';
@Catch()
export class ExceptionsFilter implements TelegrafExceptionFilter {
  constructor(private logger: LoggingService) {}
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();
    if (ctx.callbackQuery) {
      try {
        await ctx.answerCbQuery('خطایی رخ داد! لطفا مجدد امتحان کنید', {
          show_alert: true,
        });
      } catch {}
    } else {
      try {
        await ctx.sendMessage('خطایی رخ داد! لطفا مجدد امتحان کنید', {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: mainMenuInlineKeyboards,
          },
        });
      } catch {}
    }
    //send Logger
    this.logger.error(exception.message, exception.stack);
  }
}
