import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from '../shared/interfaces/context.interface';
import { startKeyboard } from './keyboards/inline_keyboards/start.keyboard';

@Update()
export class UserUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply(`سلام به ربـات بلـولیـست خوش آمدید`, {
      reply_markup: {
        inline_keyboard: startKeyboard,
        one_time_keyboard: true,
        selective: true,
      },
    });
  }
}
