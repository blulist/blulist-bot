import { Injectable } from '@nestjs/common';
import { Context } from '../../shared/interfaces/context.interface';
import { TrackRepository } from '../track.repository';

@Injectable()
export class ManageTrackService {
  constructor(private trackRepo: TrackRepository) {}

  async deleteTrackFromPlaylist(ctx: Context, trackId: string) {
    await this.trackRepo.deleteOneByUniqueId(trackId);
    await ctx.deleteMessage();
    await ctx.answerCbQuery('✅ فایل مورد نظر با موفقیت از پلی لیست حذف شد.', {
      show_alert: true,
    });
  }
}
