import { Injectable } from '@nestjs/common';
import { PlaylistRepository } from '../playlist.repository';
import * as crypto from 'crypto';

import {
  backToMainMenuPlaylist,
  editPlaylistKeyboard,
  playlistKeyboard,
} from '../keyboards/inline_keyboards/playlist.keyboard';
import { Context } from '../../shared/interfaces/context.interface';
import { RedisService } from '../../../redis/redis.service';
import { Audio } from 'telegraf/types';
import { TrackRepository } from '../../track/track.repository';
import {
  Playlist,
  PlaylistWithCounts,
} from '../../shared/interfaces/playlist.interface';
import { getRandomString } from '../../../../shared/utils/random.util';
import { InlineKeyboardButton } from '../../shared/interfaces/keyboard.interface';
import { getShowPlaylistMsg } from '../messages/showPlaylist.msg';
import { mainMenuInlineKeyboards } from '../../shared/keyboards/main.keyboard';
import { inlineCbKeys } from '../../shared/constants/callbacks.constant';
@Injectable()
export class ManagePlaylistService {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  async addTrack(ctx: Context, redisKey: string): Promise<string> {
    const audioString = await this.redisService.get(redisKey);
    if (!audioString) {
      await ctx.reply('❌ معتبر نیست یا فرصت به اتمام رسیده', {
        reply_to_message_id: ctx.message.message_id,
        reply_markup: { inline_keyboard: mainMenuInlineKeyboards },
      });
      return;
    }

    const playlist: Playlist | null = await this.playlistRepo.findBySlug(
      ctx.playlist.slug,
    );
    if (!playlist) {
      await ctx.reply('❌ پلی لیست معتبر نیست یا حذف شده !', {
        reply_to_message_id: ctx.message.message_id,
        reply_markup: { inline_keyboard: mainMenuInlineKeyboards },
      });
      return;
    }
    const audio: Audio = JSON.parse(audioString);
    const thumbnail = audio.thumb;

    const track = await this.trackRepo.create({
      playlistId: playlist.id,
      addedById: ctx.from.id,
      file_id: audio.file_id,
      title: audio.title || audio.file_name,
      file_unique_id: audio.file_unique_id,
      duration: audio.duration || 0,
      performer:
        audio.performer == '<unknown>'
          ? 'N/A'
          : audio.performer || audio.file_name,
      uniqueId: getRandomString(10),
      thumbnail: thumbnail ? thumbnail.file_id || '' : '',
    });
    const text = ` ✅ فایل <code>${track.performer}</code> با موفقیت به پلی لیست <u>${playlist.name}</u> با ایدی <code>${playlist.slug}</code> اضافه شد.`;

    await ctx.editMessageText(text, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: mainMenuInlineKeyboards,
      },
    });
    await this.redisService.del(redisKey);
  }

  async myPlaylists(ctx: Context, userId: number): Promise<void> {
    const page = Number(ctx.match[1]) || 1;
    const perPage = 8;

    const totalCount: number = await this.playlistRepo.getCountsByUserId(
      userId,
    );

    const totalPages = Math.ceil(totalCount / perPage);

    const skip = (page - 1) * perPage;

    const playlists: Playlist[] = await this.playlistRepo.findAllByUserId(
      userId,
      page,
      perPage,
    );
    if (!playlists.length) {
      await ctx.sendMessage(
        `• در حال حاضر پلی لیستی ندارید !
از دکمه های زیر یک پلی لیست ایجاد کنید:
`,
        {
          reply_markup: {
            inline_keyboard: mainMenuInlineKeyboards,
          },
        },
      );
      return;
    }

    const paginationKeyboard: InlineKeyboardButton[] = [];
    if (page > 1) {
      paginationKeyboard.push({
        text: '⭀ صفحه قبلی',
        callback_data: `${inlineCbKeys.MY_PLAYLISTS}:${page - 1}`,
      });
    }
    if (page < totalPages) {
      paginationKeyboard.push({
        text: '⥱ صفحه بعدی',
        callback_data: `${inlineCbKeys.MY_PLAYLISTS}:${page + 1}`,
      });
    }

    const keyboards: InlineKeyboardButton[][] = playlists.map((pl) => [
      {
        text: `${pl.isPrivate ? '🔐' : '🔓'}〡${pl.name}〡${pl.slug}`,
        callback_data: `show_playlist:${pl.slug}`,
      },
    ]);

    keyboards.push(paginationKeyboard);

    await ctx.deleteMessage();

    await ctx.sendMessage(
      `
تعداد پلی لیست ها: ${totalCount}
یک پلی لیست رو جهت مدیریت انتخاب کنید:
    `,
      {
        reply_markup: {
          inline_keyboard: keyboards,
        },
      },
    );
  }

  async showPlaylist(ctx: Context, playlistSlug: string) {
    const playlist: PlaylistWithCounts = (await this.playlistRepo.findBySlug(
      playlistSlug,
      true,
    )) as PlaylistWithCounts;
    if (!playlist) return ctx.answerCbQuery(`❌ پلی لیست معتبر نیست`);
    await ctx.deleteMessage();
    if (playlist.bannerId) {
      const banner = await ctx.telegram.getFile(playlist.bannerId);

      await ctx.sendPhoto(banner.file_id, {
        caption: getShowPlaylistMsg(playlist),
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: playlistKeyboard(playlist.slug),
          selective: true,
          one_time_keyboard: true,
        },
      });
    } else
      await ctx.sendMessage(getShowPlaylistMsg(playlist), {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: playlistKeyboard(playlist.slug),
          selective: true,
          one_time_keyboard: true,
        },
      });
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
      {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: backToMainMenuPlaylist(playlistSlug),
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await ctx.deleteMessage(ctx.scene.session.msgId);
    await ctx.scene.leave();
  }

  async editPlaylistBanner(
    ctx: Context,
    playlistSlug: string,
    newBannerId: string,
  ) {
    const playlist = await this.playlistRepo.updateBySlug(playlistSlug, {
      bannerId: newBannerId,
    });
    await ctx.reply(
      `• بنر پلی لیست <b>${playlist.name}</b> با ایدی <code>${playlist.slug}</code> بروزرسانی شد.`,
      {
        parse_mode: 'HTML',
        reply_to_message_id: ctx.message.message_id,
        reply_markup: {
          inline_keyboard: backToMainMenuPlaylist(playlistSlug),
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await ctx.deleteMessage(ctx.scene.session.msgId);
  }

  async toggleStatus(ctx: Context) {
    const playlist: PlaylistWithCounts = ctx.playlist as PlaylistWithCounts;
    const { isPrivate } = await this.playlistRepo.updateBySlug(playlist.slug, {
      isPrivate: !playlist.isPrivate,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const photo = ctx.callbackQuery.message.photo;

    if (photo && photo.length) {
      await ctx.editMessageCaption(getShowPlaylistMsg(playlist), {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: editPlaylistKeyboard(playlist.slug),
        },
      });
    } else
      await ctx.editMessageText(getShowPlaylistMsg(playlist), {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: editPlaylistKeyboard(playlist.slug),
        },
      });
    await ctx.answerCbQuery(
      `وضعیت مشاهده به ${isPrivate ? '🔐 خصوصی' : '🔓 عمومی'} تغییر کرد. `,
    );
  }
  async showMyPlaylistFiles(ctx: Context) {
    const page = Number(ctx.match[2]) || 1;
    const perPage = 1;

    const totalCount: number = await this.trackRepo.getCountsByPlaylistId(
      ctx.playlist.id,
    );

    const totalPages = Math.ceil(totalCount / perPage);

    const paginationKeyboard: InlineKeyboardButton[] = [];
    if (page > 1) {
      paginationKeyboard.push({
        text: '⭀ صفحه قبلی',
        callback_data: `${inlineCbKeys.SHOW_MY_FILES}:${ctx.playlist.slug}:${
          page - 1
        }`,
      });
      paginationKeyboard.push({
        text: '🏡',
        callback_data: `${inlineCbKeys.SHOW_MY_FILES}:${ctx.playlist.slug}:1`,
      });
    }
    if (page < totalPages) {
      paginationKeyboard.push({
        text: '⥱ صفحه بعدی',
        callback_data: `${inlineCbKeys.SHOW_MY_FILES}:${ctx.playlist.slug}:${
          page + 1
        }`,
      });
    }

    const files = await this.trackRepo.findAll(ctx.playlist.id, page, perPage);

    await ctx.deleteMessage();
    const buttons: InlineKeyboardButton[][] = files.map((f) => [
      {
        text: `${f.title} • ${f.performer}`,
        callback_data: `selectTrack:${ctx.playlist.slug}:${f.uniqueId}`,
      },
    ]);
    buttons.unshift([
      {
        text: '> بازگشت',
        callback_data: `backTo:mainPlaylist:${ctx.playlist.slug}`,
      },
      {
        text: 'ارسال همه',
        callback_data: `sendAllTracks:${ctx.playlist.slug}`,
      },
    ]);
    buttons.push(paginationKeyboard);

    await ctx.sendMessage(
      `فایل های پلی لیست <b>${ctx.playlist.name}</b> با ایدی <code>${ctx.playlist.slug}</code>
🗃️ تعداد فایل ها : ${totalCount}
لطفا یک گزینه رو انتخاب کنید:
`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: buttons,
        },
      },
    );
  }

  async deletePlaylist(ctx: Context) {
    try {
      await this.playlistRepo.deleteOneBySlug(ctx.playlist.slug);
      await ctx.editMessageText(
        `✅  پلی لیست <b>${ctx.playlist.name}</b> با آیدی <code>${ctx.playlist.slug}</code> با موفقیت حذف گردید.`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: mainMenuInlineKeyboards,
          },
        },
      );
    } catch (e) {
      await ctx.editMessageText(`خطا در حذف پلی لیست!`, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: mainMenuInlineKeyboards,
        },
      });
    }
  }
}
