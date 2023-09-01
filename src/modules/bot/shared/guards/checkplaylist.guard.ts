import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from '../interfaces/context.interface';
import { PlaylistRepository } from '../../playlist/repositories/playlist.repository';
import { Playlist } from '../interfaces/playlist.interface';

@Injectable()
export class CheckPlaylistGuard implements CanActivate {
  constructor(private playlistRepo: PlaylistRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxCreate = TelegrafExecutionContext.create(context);
    const ctx = ctxCreate.getContext<Context>();
    const playlistSlug = ctx.match[1];
    const playlist: Playlist | null = await this.playlistRepo.findbySlug(
      playlistSlug,
    );
    if (!playlist) {
      throw new TelegrafException('پلی لیست معتبر نیست');
    }
    ctx.playlist = playlist;
    return true;
  }
}
