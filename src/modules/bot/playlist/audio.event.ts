import { Ctx, Update, On, Message } from 'nestjs-telegraf';

import { Context } from '../shared/interfaces/context.interface';
import { RedisService } from '../../redis/redis.service';
import { getRandomString } from '../../../shared/utils/random.util';
import { PrismaClient } from '@prisma/client';
import { InlineKeyboardButton } from '../shared/interfaces/keyboard.interface';

@Update()
export class AudioEvent {
  constructor(private redis: RedisService) {}
  @On('audio')
  async onSendAudio(@Ctx() ctx: Context, @Message('audio') audio: any) {
    // const fileUrl = await ctx.telegram.getFile(audio.file_id);
    const key: string = getRandomString(12);
    this.redis.setex(key, 60, JSON.stringify(audio));
    const client = new PrismaClient();
    const playlists = await client.playlist.findMany({
      where: {
        ownerId: ctx.from.id,
      },
    });
    const btns: InlineKeyboardButton[][] = playlists.map((pl) => [
      {
        text: `${pl.name} - ${pl.slug}`,
        callback_data: `select_playlist:${pl.slug}:${key}`,
      },
    ]);

    await ctx.reply(
      `• پلی لیست مورد نظر رو جهت افزودن فایل انتـخاب کنید:
⚠️ فقط 1 دقیقه فرصت دارید.
    `,
      {
        reply_markup: {
          inline_keyboard: btns,
        },
        reply_to_message_id: ctx.message.message_id,
      },
    );
  }
}
