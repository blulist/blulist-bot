import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from '../shared/interfaces/context.interface';
import { mainMenuInlineKeyboards } from '../shared/keyboards/main.keyboard';
import { UserService } from './services/user.service';
import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ExceptionsFilter } from '../shared/filters/exceptions.filter';
import { LoggingInterceptor } from '../shared/interceptors/logging.interceptor';
import { BotInfo } from '../shared/constants/bot.constant';
import { CheckPlaylistGuard } from '../shared/guards/checkplaylist.guard';

@Update()
@UseFilters(ExceptionsFilter)
@UseInterceptors(LoggingInterceptor)
export class UserUpdate {
  constructor(private userService: UserService) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    if (ctx.startPayload) {
      const slugAndRef = ctx.startPayload.split('_');
      const slug: string = slugAndRef[0];
      const ref: string | null = slugAndRef[1] || null;
      await this.userService.showUserPlaylist(ctx, slug, ref);
      return;
    }
    await ctx.reply(
      `
•     سلام به ربـات ${BotInfo.NameFa} خوش آمدید 🐳

*یک پلی لیست با استفاده از کیبورد زیر بسازید و سپس موزیک های خودتون رو  فوروارد کنید.*
    `,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: mainMenuInlineKeyboards,
          one_time_keyboard: true,
          selective: true,
        },
      },
    );
  }

  @Action(/show_user_playlist:(.*):(.*)/)
  @UseGuards(CheckPlaylistGuard)
  onShowPlaylist(@Ctx() ctx: Context) {
    console.log(ctx.match);
  }
}
