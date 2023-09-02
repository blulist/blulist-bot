import { Action, Ctx, Update } from 'nestjs-telegraf';
import { PlaylistService } from '../services/playlist.service';
import { Context } from '../../shared/interfaces/context.interface';
import { UseGuards } from '@nestjs/common';
import { CheckPlaylistGuard } from '../../shared/guards/checkplaylist.guard';

@Update()
export class PlaylistUpdate {
  constructor(private playlistService: PlaylistService) {}
  @Action(/likePlaylist:(.*)/)
  @UseGuards(CheckPlaylistGuard)
  async onLike(@Ctx() ctx: Context) {
    await this.playlistService.toggleLike(ctx);
  }
}
