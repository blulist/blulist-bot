import { Injectable } from '@nestjs/common';
import { PlaylistRepository } from './playlist.repository';
import * as crypto from 'crypto';

import { playlistKeyboard } from './keyboards/inline_keyboards/playlist.keyboard';
import { Context } from '../shared/interfaces/context.interface';
import { RedisService } from '../../redis/redis.service';
import { Audio } from 'telegraf/types';
import { TrackRepository } from './repositories/track.repository';
import { Playlist } from '../shared/interfaces/playlist.interface';
import { getRandomString } from '../../../shared/utils/random.util';
import { inlineCbKeys } from '../shared/constants/callbacks.constant';
import { InlineKeyboardButton } from '../shared/interfaces/keyboard.interface';
@Injectable()
export class PlaylistService {
  constructor(
    private playlistRepo: PlaylistRepository,
    private redisService: RedisService,
    private trackRepo: TrackRepository,
  ) {}
  async create(
    ctx: Context,
    { playlistName, senderId }: { playlistName: string; senderId: number },
  ) {
    const uuId = crypto.randomUUID().slice(0, 8);
    await this.playlistRepo.create({
      slug: uuId,
      name: playlistName,
      ownerId: senderId,
    });
    await ctx.reply(
      `• پلی لیست به نام  <u> ${playlistName}  </u>  و ایدی <code>${uuId}</code> ساخته شد.
↲ آمار بازدید: 0
↲ آمار لایک: 0
↲ تعداد محتوا: 0
↲ وضعیت مشاهده: عمومی

یک گزینه رو انتخاب کنید:
`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: playlistKeyboard,
          selective: true,
          one_time_keyboard: true,
        },
      },
    );
  }

  async addTrack(
    ctx: Context,
    playlistkey: string,
    redisKey: string,
  ): Promise<string> {
    const audioString = await this.redisService.get(redisKey);
    if (!audioString) return '❌ معتبر نیست یا فرصت به اتمام رسیده';
    const playlist: Playlist | null = await this.playlistRepo.findbySlug(
      playlistkey,
    );
    if (!playlist) return '❌ پلی لیست معتبر نیست یا حذف شده !';
    const audio: Audio = JSON.parse(audioString);
    const track = await this.trackRepo.create({
      playlistId: playlist.id,
      addedById: ctx.from.id,
      file_id: audio.file_id,
      title: audio.title,
      file_unique_id: audio.file_unique_id,
      performer: audio.performer,
      uniqueId: getRandomString(10),
    });
    return ` ✅ فایل <code>${track.performer}</code> با موفقیت به پلی لیست <u>${playlist.name}</u> با ایدی <code>${playlist.slug}</code> اضافه شد.`;
  }

  async myPlaylists(
    ctx: Context,
    userId: number,
  ): Promise<InlineKeyboardButton[][]> {
    const playlists = await this.playlistRepo.findAllAUser(userId);

    return playlists.map((pl) => [
      {
        text: `${pl.isPrivate ? '🔐' : '🔓'}〡${pl.name}〡${pl.slug}`,
        callback_data: `playlist:${pl.slug}`,
      },
    ]);
  }
}
