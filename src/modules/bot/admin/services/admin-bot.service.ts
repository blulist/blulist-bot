import { Injectable } from '@nestjs/common';
import { PlaylistRepository } from '../../playlist/playlist.repository';
import { TrackRepository } from '../../track/track.repository';
import { Context } from '../../shared/interfaces/context.interface';

@Injectable()
export class AdminBotService {
  constructor(
    private playlistRepo: PlaylistRepository,
    private trackRepo: TrackRepository,
  ) {}

  async getAmar(ctx: Context) {
    const allPlaylist = await this.playlistRepo.getAllPlaylistCount(null);
    const todayPlaylistCount = await this.playlistRepo.getTodayPlaylistCount();
    await ctx.reply(
      `
- All Playlist Count: ${allPlaylist}
- Today Playlist Count: ${todayPlaylistCount}
   `,
      {
        reply_to_message_id: ctx.message.message_id,
      },
    );
  }
}
