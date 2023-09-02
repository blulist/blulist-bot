import { Action, Ctx, Sender, Update } from 'nestjs-telegraf';
import { backToMainPlaylistRegex } from '../regexps/manage.regex';
import { Context } from '../../shared/interfaces/context.interface';
import { playlistKeyboard } from '../keyboards/inline_keyboards/playlist.keyboard';
import { ManagePlaylistService } from '../services/manage-playlist.service';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { ExceptionsFilter } from '../../shared/filters/exceptions.filter';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';

@Update()
@UseFilters(ExceptionsFilter)
@UseInterceptors(LoggingInterceptor)
export class BackAndCancelHandlerUpdate {
  constructor(private managePlaylistService: ManagePlaylistService) {}
  @Action(backToMainPlaylistRegex)
  async onBackToMainPlaylist(@Ctx() ctx: Context) {
    await this.managePlaylistService.showPlaylist(ctx, ctx.match[1]);
    // await ctx.editMessageReplyMarkup({
    //   inline_keyboard: playlistKeyboard(ctx.match[1]),
    // });
  }

  @Action('cancel')
  async onCancel(@Ctx() ctx: Context) {
    await ctx.scene.leave();
    await ctx.answerCbQuery('عملیات فعلی لغو شد.');
    await ctx.deleteMessage();
  }

  @Action('backTo:myPlaylists')
  onBackToMyPlaylists(@Ctx() ctx: Context, @Sender('id') id) {
    return this.managePlaylistService.myPlaylists(ctx, id);
  }

  @Action('soon')
  async onSoonButton(@Ctx() ctx: Context) {
    await ctx.answerCbQuery('این بخش به زودی اضافه میشه', {
      show_alert: true,
    });
  }
}
