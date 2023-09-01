import { Injectable } from '@nestjs/common';
import { Context } from '../../shared/interfaces/context.interface';
import { InlineKeyboardButton } from '../../shared/interfaces/keyboard.interface';
import { TrackRepository } from '../track.repository';
import { Track } from '../../shared/interfaces/track.interface';
import { PlaylistWithTracks } from '../../shared/interfaces/playlist.interface';

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

    const fileUrl = await ctx.telegram.getFile(track.file_id);
    await ctx.sendChatAction('upload_document');

    await ctx.sendAudio(fileUrl.file_id, {
      reply_markup: { inline_keyboard: buttons },
      caption: `
آپلود شده توسط: <a href="tg://user?id=${track.addedById}">این کاربر</a>      
BluList - بلـولیـست
@bluListBot `,
      parse_mode: 'HTML',
    });
  }
  async sendAllTracks(ctx: Context, userId: number) {
    const playlist = ctx.playlist as PlaylistWithTracks;
    const isAdmin = Number(playlist.ownerId) === userId;
    if (!playlist.tracks.length) {
      await ctx.answerCbQuery('فایلی در پلی لیست یافت نشد', {
        show_alert: true,
      });
      return;
    }
    await ctx.answerCbQuery('درحال ارسال فایل ها...');

    for (const track of playlist.tracks) {
      const buttons: InlineKeyboardButton[][] = [[]];
      if (isAdmin) {
        buttons.push([
          {
            text: 'حذف  فایل از پلی لیست',
            callback_data: `removeTrack:${ctx.playlist.slug}:${track.uniqueId}`,
          },
        ]);
      }

      const fileUrl = await ctx.telegram.getFile(track.file_id);
      await ctx.sendChatAction('upload_document');

      await ctx.sendAudio(fileUrl.file_id, {
        reply_markup: { inline_keyboard: buttons },
        caption: `
BluList - بلـولیـست
@bluListBot `,
        parse_mode: 'HTML',
      });
    }
  }
}
