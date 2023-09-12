import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf';
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
  async onShowPlaylist(@Ctx() ctx: Context) {
    await this.userService.onTrackPagination(ctx);
  }

  @Command('privacy')
  async onPrivacyCmd(@Ctx() ctx: Context) {
    const content = `
📋 *قوانین استفاده از بلولیـست:*

1. استفاده از هرگونه کلمات رکیک و نامناسب به قوانین جمهوری اسلامی ایران ممنوع است.

2. تلاش برای تزریق کدهای مخرب ممنوع و درصورت مشاهده کاربر مسدود خواهد شد.

3. لطفا به قوانین کپی رایت احترام بزارید و موزیک های جدید رو در پلی لیست های عمومی قرار ندید. (توضیحات بیشتر در مدیریت موزیک‌های جدید)

*سیاست حفظ حریم خصوصی:*
> تمامی اطلاعات شما در این ربات محفوظ می‌مانند.

*شخصی‌سازی اطلاعات:*
> شما می‌توانید اطلاعات شخصی خود که نمی خواهید در دسترس عموم باشد رو غیرفعال کنید. (مانند یوزرنیم،نام)

*مدیریت موزیک‌های جدید:*
> لطفاً توجه داشته باشید که با اشتراک‌گذاری موزیک‌های جدید در پلی لیست‌های عمومی، ممکن است برخورد شود. ما از قوانین کپی‌رایت پیروی می‌کنیم و موزیک‌هایی که متعلق به شما نیستند یا اشتراک غیرقانونی دارند، ممکن است حذف شوند.

🙏 ممنون که با رعایت قوانین به پیشرفت ما کمک میکنید.


${BotInfo.FooterMessages}
   `;
    await ctx.reply(content, {
      parse_mode: 'Markdown',
    });
  }
}
