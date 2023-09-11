import { Action, Ctx, Sender, Update } from 'nestjs-telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { CheckPlaylistGuard } from '../../shared/guards/checkplaylist.guard';
import { TrackService } from '../services/track.service';
import { Context } from '../../shared/interfaces/context.interface';
import { ExceptionsFilter } from '../../shared/filters/exceptions.filter';

@Update()
@UseFilters(ExceptionsFilter)
export class TrackUpdate {
  constructor(private trackService: TrackService) {}
  @Action(/selectTrack:(.*):(.*)/)
  @UseGuards(CheckPlaylistGuard)
  async onSelectTrack(@Ctx() ctx: Context, @Sender('id') userId: number) {
    return this.trackService.selectTrack(ctx, ctx.match[2], userId);
  }

  @Action(/sendAllTracks:(.*):(.*)/)
  @UseGuards(CheckPlaylistGuard)
  async onSendAllTracks(@Ctx() ctx: Context, @Sender('id') userId: number) {
    return this.trackService.sendAllTracks(ctx, userId);
  }
}
