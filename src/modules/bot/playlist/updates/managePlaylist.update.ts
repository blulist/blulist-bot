import { Action, Ctx, Command, Sender, Update, Message } from 'nestjs-telegraf';

import { inlineCbKeys } from '../../shared/constants/callbacks.constant';
import { Context } from '../../shared/interfaces/context.interface';
import { ManagePlaylistService } from '../services/manage-playlist.service';
import { editPlaylistKeyboard } from '../keyboards/inline_keyboards/playlist.keyboard';
import {
  editPlaylistBannerRegex,
  editPlaylistNameRegex,
  editPlaylistStatusRegex,
  editPlaylistRegex,
  showMyPlaylistFilesRegex,
  sharePlaylistRegex,
  deletePlaylistRegex,
  showPlaylistsRegex,
} from '../regexps/manage.regex';
import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CheckPlaylistGuard } from '../../shared/guards/checkplaylist.guard';
import { ExceptionsFilter } from '../../shared/filters/exceptions.filter';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { BotInfo } from '../../shared/constants/bot.constant';
import { CancelKeyboard } from '../../shared/keyboards/cancel.keyboard';

@Update()
@UseFilters(ExceptionsFilter)
@UseInterceptors(LoggingInterceptor)
export class ManagePlaylistUpdate {
  constructor(private playlistService: ManagePlaylistService) {}

  @Action(inlineCbKeys.CREATE_PLAYLIST)
  @Command('create')
  async onCreatePlaylist(@Ctx() ctx: Context, @Message('text') text: string) {
    if (text == '/create') {
      await ctx.sendMessage('اسم مورد نظر رو وارد کنید...', {
        reply_markup: {
          inline_keyboard: CancelKeyboard,
        },
      });
    } else
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
    const rediskey = ctx.match[2] as string;
    await this.playlistService.addTrack(ctx, rediskey);
  }

  @Action(showPlaylistsRegex)
  async onMyPlayLists(@Ctx() ctx: Context, @Sender('id') id: number) {
    await this.playlistService.myPlaylists(ctx, id);
  }

  @Action(/show_playlist:(.*)/)
  async onShowPlaylist(@Ctx() ctx: Context) {
    const playlistSlug = ctx.match[1] as string;

    await this.playlistService.showPlaylist(ctx, playlistSlug);
  }

  @Action(editPlaylistRegex)
  async onEditClick(@Ctx() ctx: Context) {
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

  @Action(showMyPlaylistFilesRegex)
  @UseGuards(CheckPlaylistGuard)
  async onShowMyPlaylistFiles(@Ctx() ctx: Context) {
    return this.playlistService.showMyPlaylistFiles(ctx);
  }

  @Action(sharePlaylistRegex)
  async onSharePlaylist(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    const slug = ctx.match[1];
    await ctx.sendMessage(
      `
• خیلی خوشحالیم که پلتفرم مارو انتخاب کرده اید ! 😍
برای اشتراک گذاری پلی لیـست کافیه یکی از لینک های زیر رو به دوستان یا در پلفترم های مختلف به اشتراک بگذارید:

<b>🤖 از طریـق ربات: </b>
https://t.me/${BotInfo.UsernameWithoutPerfix}?start=${slug}

<b>🌐 و برای سایت:</b>

https://blulist.ir/playlists/${slug}
 

${BotInfo.FooterMessages}
    `,
      {
        parse_mode: 'HTML',
      },
    );
  }

  @Action(deletePlaylistRegex)
  @UseGuards(CheckPlaylistGuard)
  async onDeletePlaylist(@Ctx() ctx: Context) {
    await ctx.scene.enter('are_u_sure_for_deleting_playlist');
  }
}
