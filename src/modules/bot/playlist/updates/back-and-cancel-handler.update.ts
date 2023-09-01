import { Action, Ctx, Update } from 'nestjs-telegraf';
import { backToMainPlaylistRegex } from '../regexps/manage.regex';
import { Context } from '../../shared/interfaces/context.interface';
import { playlistKeyboard } from '../keyboards/inline_keyboards/playlist.keyboard';

@Update()
export class BackAndCancelHandlerUpdate {
  @Action(backToMainPlaylistRegex)
  async onBackToMainPlaylist(@Ctx() ctx: Context) {
    await ctx.editMessageReplyMarkup({
      inline_keyboard: playlistKeyboard(ctx.match[1]),
    });
  }

  @Action('cancel')
  async onCancel(@Ctx() ctx: Context) {
    await ctx.scene.leave();
    await ctx.answerCbQuery('عملیات فعلی لغو شد.');
    await ctx.deleteMessage();
  }
}
