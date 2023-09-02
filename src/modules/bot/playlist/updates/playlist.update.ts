import { Action, Ctx, Update } from 'nestjs-telegraf';
import { PlaylistService } from '../services/playlist.service';
import { Context } from '../../shared/interfaces/context.interface';
import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CheckPlaylistGuard } from '../../shared/guards/checkplaylist.guard';
import { ExceptionsFilter } from '../../shared/filters/exceptions.filter';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';

@Update()
@UseFilters(ExceptionsFilter)
@UseInterceptors(LoggingInterceptor)
export class PlaylistUpdate {
  constructor(private playlistService: PlaylistService) {}
  @Action(/likePlaylist:(.*)/)
  @UseGuards(CheckPlaylistGuard)
  async onLike(@Ctx() ctx: Context) {
    await this.playlistService.toggleLike(ctx);
  }
}
