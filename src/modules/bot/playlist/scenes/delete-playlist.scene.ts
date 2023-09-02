import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from '../../shared/interfaces/context.interface';
import { UseGuards } from '@nestjs/common';
import { CheckPlaylistGuard } from '../../shared/guards/checkplaylist.guard';
import { ManagePlaylistService } from '../services/manage-playlist.service';
import { checkPlaylistPermission } from '../../shared/guards/playlist-permission.guard';

@Scene('are_u_sure_for_deleting_playlist')
export class DeletePlaylistScene {
  constructor(private managePlaylistService: ManagePlaylistService) {}
  @SceneEnter()
  async onEnter(@Ctx() ctx: Context) {
    await ctx.deleteMessage();
    await ctx.sendMessage(
      `• آیا مطمعنید میخواهید پلی لیست <b>${ctx.playlist.name}</b> رو با آیدی <code>${ctx.playlist.slug}</code> رو حذف کنید؟ `,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🗑️ حذف پلی لیسـت',
                callback_data: `deletePlaylist:${ctx.playlist.slug}`,
              },
            ],
            [
              {
                text: '> بازگشت',
                callback_data: `backTo:mainPlaylist:${ctx.playlist.slug}`,
              },
            ],
          ],
        },
      },
    );
  }

  @Action(/deletePlaylist:(.*)/)
  @UseGuards(CheckPlaylistGuard)
  @UseGuards(checkPlaylistPermission())
  async onDelete(@Ctx() ctx: Context) {
    await this.managePlaylistService.deletePlaylist(ctx);
    await ctx.scene.leave();
  }
}
