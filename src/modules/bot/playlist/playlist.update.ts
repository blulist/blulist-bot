import { Action, Update } from 'nestjs-telegraf';

import { inlineCbKeys } from '../shared/constants/callbacks.constant';
import { Context } from '../shared/interfaces/context.interface';

@Update()
export class PlaylistUpdate {
  @Action(inlineCbKeys.CREATE_PLAYLIST)
  async onCreatePlaylist(ctx: Context) {
    await ctx.editMessageText('اسم مورد نظر رو وارد کنید...');
    await ctx.scene.enter('send_playlist_name');
  }
}
