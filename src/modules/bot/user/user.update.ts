import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from '../shared/interfaces/context.interface';
import { mainMenuInlineKeyboards } from '../shared/keyboards/main.keyboard';

@Update()
export class UserUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply(
      `
    سلام به ربـات بلـولیـست خوش آمدید 🐳
یک پلی لیست با استفاده از کیبورد زیر بسازید و سپس موزیک های خودتون رو  فوروارد کنید.
    `,
      {
        reply_markup: {
          inline_keyboard: mainMenuInlineKeyboards,
          one_time_keyboard: true,
          selective: true,
        },
      },
    );
  }
}
