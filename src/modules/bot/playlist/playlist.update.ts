import { Action, Ctx, Message, Sender, Update } from 'nestjs-telegraf';

import { inlineCbKeys } from '../shared/constants/callbacks.constant';
import { Context } from '../shared/interfaces/context.interface';
import { PlaylistService } from './playlist.service';

const editPlaylistRegex = new RegExp(`^${inlineCbKeys.EDIT_PLAYLIST}:(.*)$`);

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
    const playlistSlug = ctx.match[1] as string;

    const result = await this.playlistService.showPlaylist(ctx, playlistSlug);
    result.args
      ? await ctx.reply(result.text, result.args as any)
      : await ctx.reply(result.text);

    await ctx.answerCbQuery();
  }

  @Action(editPlaylistRegex)
  async onEditClick(@Ctx() ctx: Context, @Message('text') content: string) {
    await ctx.editMessageReplyMarkup({
      inline_keyboard: [
        [
          { text: '🖼️ ویرایش بنر', callback_data: 'test' },
          { text: '📝 ویرایش نام', callback_data: 'test' },
        ],
        [
          {
            text: '👀 تغییر وضعیت',
            callback_data: 'test',
          },
        ],
        [{ text: '> بازگشت', callback_data: 'back:show_playlist:xx' }],
      ],
    });
  }
}
