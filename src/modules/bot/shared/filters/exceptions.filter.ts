import { ArgumentsHost, Catch, ExecutionContext } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Context } from '../interfaces/context.interface';
import {
  TelegrafExceptionFilter,
  TelegrafArgumentsHost,
  TelegrafException,
} from 'nestjs-telegraf';
import { mainMenuInlineKeyboards } from '../keyboards/main.keyboard';
import { LoggingService } from '../../../logging/logging.service';
@Catch()
export class ExceptionsFilter implements TelegrafExceptionFilter {
  constructor(private logger: LoggingService) {}
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();
    let isServerError = true;
    let msg = 'خطایی رخ داد! لطفا مجدد امتحان کنید';
    if (exception instanceof TelegrafException) {
      isServerError = false;
      msg = exception.message;
    }
    if (ctx.callbackQuery) {
      try {
        await ctx.answerCbQuery(msg, {
          show_alert: true,
        });
      } catch {}
    } else {
      try {
        await ctx.sendMessage(msg, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: mainMenuInlineKeyboards,
          },
        });
      } catch {}
    }
    //send Logger
    if (isServerError) this.logger.error(exception.message, exception.stack);
  }
}
