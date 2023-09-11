import { Injectable } from '@nestjs/common';
import { Context } from '../../shared/interfaces/context.interface';
import { InlineKeyboardButton } from '../../shared/interfaces/keyboard.interface';
import { TrackRepository } from '../track.repository';
import { Track } from '../../shared/interfaces/track.interface';
import { PlaylistWithCounts } from '../../shared/interfaces/playlist.interface';
import { BotInfo } from '../../shared/constants/bot.constant';

@Injectable()
export class TrackService {
  constructor(private trackRepo: TrackRepository) {}

  async selectTrack(ctx: Context, trackId: string, userId: number) {
    const playlist = ctx.playlist;
    const isAdmin = Number(playlist.ownerId) === userId;

    const buttons: InlineKeyboardButton[][] = [[]];

    if (isAdmin) {
      buttons.push([
        {
          text: 'حذف  فایل از پلی لیست',
          callback_data: `removeTrack:${ctx.playlist.slug}:${trackId}`,
        },
      ]);
    }

    const track: Track | null = await this.trackRepo.findOneByUniqueId(trackId);
    if (!track) {
      await ctx.answerCbQuery('❌ فایل وجود ندارد', {
        show_alert: true,
      });
      return;
    }
    await ctx.answerCbQuery('در حال ارسال فایل...');

    await ctx.sendChatAction('upload_document');

    await ctx.sendAudio(track.file_id, {
      reply_markup: { inline_keyboard: buttons },
      caption: `
${BotInfo.FooterMessages}
 `,
      parse_mode: 'HTML',
    });
  }
  async sendAllTracks(ctx: Context, userId: number) {
    const page = Number(ctx.match[2]) || 1;
    const playlist = ctx.playlist as PlaylistWithCounts;
    const isAdmin = Number(playlist.ownerId) === userId;
    if (!playlist._count.tracks) {
      await ctx.answerCbQuery('فایلی در پلی لیست یافت نشد', {
        show_alert: true,
      });
      return;
    }
    await ctx.answerCbQuery('درحال ارسال فایل ها...');
    const tracks = await this.trackRepo.findAll(playlist.id, page, 8);
    for (const track of tracks) {
      const buttons: InlineKeyboardButton[][] = [[]];
      if (isAdmin) {
        buttons.push([
          {
            text: 'حذف  فایل از پلی لیست',
            callback_data: `removeTrack:${ctx.playlist.slug}:${track.uniqueId}`,
          },
        ]);
      }

      await ctx.sendChatAction('upload_document');

      await ctx.sendAudio(track.file_id, {
        reply_markup: { inline_keyboard: buttons },
        caption: BotInfo.FooterMessages,
        parse_mode: 'HTML',
      });
    }
  }
}
