import { Action, Ctx, Message, Sender, Update } from 'nestjs-telegraf';

import { inlineCbKeys } from '../shared/constants/callbacks.constant';
import { Context } from '../shared/interfaces/context.interface';
import { PlaylistService } from './playlist.service';
import { editPlaylistKeyboard } from './keyboards/inline_keyboards/playlist.keyboard';
import {
  editPlaylistNameRegex,
  editPlaylistRegex,
} from './regexps/manage.regex';

@Update()
export class PlaylistUpdate {
  constructor(private playlistService: PlaylistService) {}

  @Action(inlineCbKeys.CREATE_PLAYLIST)
  async onCreatePlaylist(@Ctx() ctx: Context) {
    await ctx.editMessageText('اسم مورد نظر رو وارد کنید...');
    await ctx.scene.enter('send_playlist_name');
  }

  @Action(/select_playlist:(.*):(.*)/)
  async onSelectedPlaylistAddTrack(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    const playlistSlug = ctx.match[1] as string;

    const rediskey = ctx.match[2] as string;
    const result = await this.playlistService.addTrack(
      ctx,
      playlistSlug,
      rediskey,
    );
    await ctx.editMessageText(result, { parse_mode: 'HTML' });
  }

  @Action(inlineCbKeys.MY_PLAYLISTS)
  async onMyPlayLists(@Ctx() ctx: Context, @Sender('id') id: number) {
    await ctx.answerCbQuery();
    const keyboards = await this.playlistService.myPlaylists(ctx, id);
    await ctx.editMessageText(
      `
تعداد پلی لیست ها: ${keyboards.length}
یک پلی لیست رو جهت مدیریت انتخاب کنید:
    `,
      {
        reply_markup: {
          inline_keyboard: keyboards,
        },
      },
    );
  }

  @Action(/show_playlist:(.*)/)
  async onShowPlaylist(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    const playlistSlug = ctx.match[1] as string;

    const result = await this.playlistService.showPlaylist(ctx, playlistSlug);
    result.args
      ? await ctx.reply(result.text, result.args as any)
      : await ctx.reply(result.text);
  }

  @Action(editPlaylistRegex)
  async onEditClick(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup({
      inline_keyboard: editPlaylistKeyboard(ctx.match[1] as string),
    });
  }

  @Action(editPlaylistNameRegex)
  async onEditPName(@Ctx() ctx: Context) {
    await ctx.scene.enter('enter_your_new_name');
    const playlistSlug = ctx.match[1] as string;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.scene.session.playlistSlug = playlistSlug;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.scene.session.msgId = ctx.update.callback_query.message.message_id;
  }
}
