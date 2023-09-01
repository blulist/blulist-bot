import { Action, Ctx, Update } from 'nestjs-telegraf';
import { UseGuards } from '@nestjs/common';
import { CheckPlaylistGuard } from '../../shared/guards/checkplaylist.guard';
import { checkPlaylistPermission } from '../../shared/guards/playlist-permission.guard';
import { Context } from '../../shared/interfaces/context.interface';
import { ManageTrackService } from '../services/manage-track.service';

@Update()
export class ManageTrackUpdate {
  constructor(private manageTrackService: ManageTrackService) {}

  @Action(/removeTrack:(.*):(.*)/)
  @UseGuards(CheckPlaylistGuard)
  @UseGuards(checkPlaylistPermission())
  async onDeleteTrack(@Ctx() ctx: Context) {
    return this.manageTrackService.deleteTrackFromPlaylist(ctx, ctx.match[2]);
  }
}
