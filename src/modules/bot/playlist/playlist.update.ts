import { Action, Ctx, Update } from 'nestjs-telegraf';

import { inlineCbKeys } from '../shared/constants/callbacks.constant';
import { Context } from '../shared/interfaces/context.interface';
import { PlaylistService } from './playlist.service';

@Update()
export class PlaylistUpdate {
  constructor(private playlistService: PlaylistService) {}

  @Action(inlineCbKeys.CREATE_PLAYLIST)
  async onCreatePlaylist(@Ctx() ctx: Context) {
    await ctx.editMessageText('اسم مورد نظر رو وارد کنید...');
    await ctx.scene.enter('send_playlist_name');
  }

  @Action(/select_playlist:(.*):(.*)/)
  async onSelectedPlaylist(@Ctx() ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const playlistSlug = ctx.match[1] as string;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const rediskey = ctx.match[2] as string;
    const result = await this.playlistService.addTrack(
      ctx,
      playlistSlug,
      rediskey,
    );
    await ctx.editMessageText(result, { parse_mode: 'HTML' });
  }
}
