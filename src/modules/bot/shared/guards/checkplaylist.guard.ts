import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../interfaces/context.interface';
import { PlaylistRepository } from '../../playlist/playlist.repository';
import { Playlist, PlaylistWithCounts } from '../interfaces/playlist.interface';

@Injectable()
export class CheckPlaylistGuard implements CanActivate {
  constructor(private playlistRepo: PlaylistRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxCreate = TelegrafExecutionContext.create(context);
    const ctx = ctxCreate.getContext<Context>();
    const playlistSlug = ctx.match[1];
    const playlist: PlaylistWithCounts | null =
      (await this.playlistRepo.findBySlug(
        playlistSlug,
        true,
      )) as PlaylistWithCounts | null;

    const msg = 'پلی لیست معتبر نیست';

    if (!playlist) throw new TelegrafException(msg);

    ctx.playlist = playlist;
    return true;
  }
}
