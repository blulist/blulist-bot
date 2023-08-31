import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from '../shared/interfaces/context.interface';
import { inlineCbKeys } from '../shared/constants/callbacks.constant';

@Update()
export class UserUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply(`سلام به ربـات بلـولیـست خوش آمدید`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'پلی لیست های من', callback_data: 'test' },
            {
              text: 'ساخت پلی لیست',
              callback_data: inlineCbKeys.CREATE_PLAYLIST,
            },
          ],
          [{ text: 'ساخت پلی لیست', callback_data: 'test' }],
        ],
        one_time_keyboard: true,
        selective: true,
      },
    });
  }
}
