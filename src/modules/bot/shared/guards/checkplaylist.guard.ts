import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../interfaces/context.interface';
import { PlaylistRepository } from '../../playlist/playlist.repository';
import { Playlist, PlaylistWithTracks } from '../interfaces/playlist.interface';

@Injectable()
export class CheckPlaylistGuard implements CanActivate {
  constructor(private playlistRepo: PlaylistRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxCreate = TelegrafExecutionContext.create(context);
    const ctx = ctxCreate.getContext<Context>();
    const playlistSlug = ctx.match[1];
    const playlist: PlaylistWithTracks | null =
      (await this.playlistRepo.findbySlug(
        playlistSlug,
        true,
      )) as PlaylistWithTracks | null;

    const msg = 'پلی لیست معتبر نیست';

    if (!playlist) throw new TelegrafException(msg);

    ctx.playlist = playlist;
    return true;
  }
}
