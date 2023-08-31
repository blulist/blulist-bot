import { Injectable } from '@nestjs/common';
import { PlaylistRepository } from './playlist.repository';
import * as crypto from 'crypto';

import { playlistKeyboard } from './keyboards/inline_keyboards/playlist.keyboard';
import { Context } from '../shared/interfaces/context.interface';

@Injectable()
export class PlaylistService {
  constructor(private playlistRepo: PlaylistRepository) {}
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
- آمار بازدید: 0
- آمار لایک: 0
- تعداد محتوا: 0

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
}
