import { Ctx, Update, On, Message } from 'nestjs-telegraf';

import { Context } from '../shared/interfaces/context.interface';
import { RedisService } from '../../redis/redis.service';
import { getRandomString } from '../../../shared/utils/random.util';
import { InlineKeyboardButton } from '../shared/interfaces/keyboard.interface';
import { PlaylistRepository } from '../playlist/playlist.repository';
import { ExtraAudio } from 'telegraf/typings/telegram-types';

@Update()
export class FileEvent {
  constructor(
    private redis: RedisService,
    private playlistRepo: PlaylistRepository,
  ) {}
  @On('audio')
  async onSendAudio(@Ctx() ctx: Context, @Message('audio') audio: any) {
    const key: string = getRandomString(12);
    this.redis.setex(key, 60, JSON.stringify(audio));
    const playlists = await this.playlistRepo.findAllByUserId(ctx.from.id, 1);
    const btns: InlineKeyboardButton[][] = playlists.map((pl) => [
      {
        text: `${pl.name}`,
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
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      },
    );
  }

  // @On('photo')
  // onPhoto(@Ctx() ctx: Context, @Message('photo') photo) {
  //   // [
  //   //   {
  //   //     file_id: 'AgACAgQAAxkBAAIBpGTw7SppYkM-a02cFUVW8s2Cl-EVAAJgvzEbjMWJU6HZMBRD_yo5AQADAgADcwADMAQ',
  //   //     file_unique_id: 'AQADYL8xG4zFiVN4',
  //   //     file_size: 891,
  //   //     width: 90,
  //   //     height: 55
  //   //   },
  //   //   {
  //   //     file_id: 'AgACAgQAAxkBAAIBpGTw7SppYkM-a02cFUVW8s2Cl-EVAAJgvzEbjMWJU6HZMBRD_yo5AQADAgADbQADMAQ',
  //   //     file_unique_id: 'AQADYL8xG4zFiVNy',
  //   //     file_size: 10483,
  //   //     width: 320,
  //   //   } ]
  // }
}
