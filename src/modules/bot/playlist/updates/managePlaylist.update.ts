import { Action, Ctx, Sender, Update } from 'nestjs-telegraf';

import { inlineCbKeys } from '../../shared/constants/callbacks.constant';
import { Context } from '../../shared/interfaces/context.interface';
import { ManagePlaylistService } from '../services/manage-playlist.service';
import { editPlaylistKeyboard } from '../keyboards/inline_keyboards/playlist.keyboard';
import {
  editPlaylistBannerRegex,
  editPlaylistNameRegex,
  editPlaylistStatusRegex,
  editPlaylistRegex,
  showMyPlaylistFiles,
} from '../regexps/manage.regex';
import { UseGuards } from '@nestjs/common';
import { CheckPlaylistGuard } from '../../shared/guards/checkplaylist.guard';

@Update()
export class ManagePlaylistUpdate {
  constructor(private playlistService: ManagePlaylistService) {}

  @Action(inlineCbKeys.CREATE_PLAYLIST)
  async onCreatePlaylist(@Ctx() ctx: Context) {
    await ctx.editMessageText('اسم مورد نظر رو وارد کنید...', {
      reply_markup: {
        inline_keyboard: [[{ text: 'لغو', callback_data: 'cancel' }]],
      },
    });
    await ctx.scene.enter('send_playlist_name');
  }

  @Action(/select_playlist:(.*):(.*)/)
  @UseGuards(CheckPlaylistGuard)
  async onSelectedPlaylistAddTrack(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    const playlistSlug = ctx.match[1] as string;

    const rediskey = ctx.match[2] as string;
    const result = await this.playlistService.addTrack(ctx, playlistSlug);
    await ctx.editMessageText(result, { parse_mode: 'HTML' });
  }

  @Action(inlineCbKeys.MY_PLAYLISTS)
  async onMyPlayLists(@Ctx() ctx: Context, @Sender('id') id: number) {
    await ctx.answerCbQuery();
    await this.playlistService.myPlaylists(ctx, id);
  }

  @Action(/show_playlist:(.*)/)
  async onShowPlaylist(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    const playlistSlug = ctx.match[1] as string;

    await this.playlistService.showPlaylist(ctx, playlistSlug);
  }

  @Action(editPlaylistRegex)
  async onEditClick(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup({
      inline_keyboard: editPlaylistKeyboard(ctx.match[1] as string),
    });
  }

  @Action(editPlaylistNameRegex)
  @UseGuards(CheckPlaylistGuard)
  async onEditPName(@Ctx() ctx: Context) {
    await ctx.scene.enter('enter_your_new_name');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.scene.session.playlistSlug = ctx.playlist.slug;
  }

  @Action(editPlaylistBannerRegex)
  @UseGuards(CheckPlaylistGuard)
  async onEditPlaylistBanner(@Ctx() ctx: Context) {
    await ctx.scene.enter('enter_your_new_banner');
    const playlistSlug = ctx.match[1] as string;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.scene.session.playlistSlug = playlistSlug;
  }

  @Action(editPlaylistStatusRegex)
  @UseGuards(CheckPlaylistGuard)
  async onEditToggleStatus(@Ctx() ctx: Context) {
    return this.playlistService.toggleStatus(ctx);
  }

  @Action(showMyPlaylistFiles)
  @UseGuards(CheckPlaylistGuard)
  async onShowMyPlaylistFiles(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    return this.playlistService.showMyPlaylistFiles(ctx);
  }
}
