import { Injectable } from '@nestjs/common';
import { PlaylistRepository } from './playlist.repository';
import * as crypto from 'crypto';

import { playlistKeyboard } from './keyboards/inline_keyboards/playlist.keyboard';
import { Context } from '../shared/interfaces/context.interface';
import { RedisService } from '../../redis/redis.service';
import { Audio } from 'telegraf/types';
import { TrackRepository } from './repositories/track.repository';
import {
  Playlist,
  PlaylistWithTracks,
} from '../shared/interfaces/playlist.interface';
import { getRandomString } from '../../../shared/utils/random.util';
import { InlineKeyboardButton } from '../shared/interfaces/keyboard.interface';
import { getShowPlaylistMsg } from './messages/showPlaylist.msg';
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
    const playlist = await this.playlistRepo.create({
      slug: uuId,
      name: playlistName,
      ownerId: senderId,
    });
    // @ts-ignore
    playlist.tracks = [];
    await ctx.reply(getShowPlaylistMsg(playlist as any), {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: playlistKeyboard(uuId),
        selective: true,
        one_time_keyboard: true,
      },
    });
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
        callback_data: `show_playlist:${pl.slug}`,
      },
    ]);
  }

  async showPlaylist(ctx: Context, playlistSlug: string) {
    const playlist: PlaylistWithTracks | null =
      await this.playlistRepo.findbySlug(playlistSlug, true);
    if (!playlist)
      return {
        text: `پلی لیست معتبر نیست`,
      };
    return {
      text: getShowPlaylistMsg(playlist),
      args: {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: playlistKeyboard(playlist.slug),
          selective: true,
          one_time_keyboard: true,
        },
      },
    };
  }

  async editPlaylistName(ctx: Context, playlistSlug: string, newName: string) {
    if (newName.length > 30)
      return await ctx.reply('❌ بیشتر از 30 کاراکتر نباید باشد.', {
        reply_to_message_id: ctx.message.message_id,
      });
    await this.playlistRepo.updateBySlug(playlistSlug, {
      name: newName,
    });
    await ctx.reply(
      `• <b>${newName}</b> به عنوان نام جدید پلی لیست <code>${playlistSlug}</code> ثبت شد.`,
      { reply_to_message_id: ctx.message.message_id, parse_mode: 'HTML' },
    );
    // @ts-ignore
    await ctx.deleteMessage(ctx.scene.session.msgId);
    await ctx.scene.leave();
  }
}
