import { ArgumentsHost, Catch, ExecutionContext } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Context } from '../interfaces/context.interface';
import {
  TelegrafExceptionFilter,
  TelegrafArgumentsHost,
} from 'nestjs-telegraf';
import { mainMenuInlineKeyboards } from '../keyboards/main.keyboard';
@Catch()
export class ExceptionsFilter implements TelegrafExceptionFilter {
  async catch(exception: any, host: TelegrafArgumentsHost): Promise<any> {
    const ctx = host.getArgs()[0] as Context;
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery('خطایی رخ داد! لطفا مجدد امتحان کنید', {
        show_alert: true,
      });
    } else {
      await ctx.sendMessage('خطایی رخ داد! لطفا مجدد امتحان کنید', {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: mainMenuInlineKeyboards,
        },
      });
    }
    //send Logger
    console.log(exception);
  }
}
