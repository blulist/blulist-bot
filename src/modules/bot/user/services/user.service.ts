import { Injectable } from '@nestjs/common';
import { Context } from '../../shared/interfaces/context.interface';
import { PlaylistRepository } from '../../playlist/playlist.repository';
import { PlaylistWithCounts } from '../../shared/interfaces/playlist.interface';
import { userPlaylistKeyboard } from '../keyboards/inline_keyboards/userPlaylist.keyboard';
import { BotInfo } from '../../shared/constants/bot.constant';
import { TrackRepository } from '../../track/track.repository';
import { InlineKeyboardButton } from '../../shared/interfaces/keyboard.interface';
import { inlineCbKeys } from '../../shared/constants/callbacks.constant';

@Injectable()
export class UserService {
  constructor(
    private playlistRepo: PlaylistRepository,
    private tracksRepo: TrackRepository,
  ) {}

  async showUserPlaylist(ctx: Context, targetSlug: string, ref: string) {
    const playlist: PlaylistWithCounts | null =
      (await this.playlistRepo.findBySlug(
        targetSlug,
        true,
      )) as PlaylistWithCounts | null;

    if (!playlist || playlist.isPrivate) {
      await ctx.reply(
        `
• متاسفانه پلی لیست مورد نظر یافت نشد!

*شما هم میتونید با ${BotInfo.NameFa} پلی لیست های خودتون رو داشته و به اشتراک بگذارید !
برای شروع /start رو بزنید*
      `,
        {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id,
        },
      );
    }

    const totalCount: number = await this.tracksRepo.getCountsByPlaylistId(
      playlist.id,
    );
    const page = 1;
    const perPage = 8;
    const totalPages = Math.ceil(totalCount / perPage);

    const newPlaylist = await this.playlistRepo.updateViewCount(playlist.slug);
    playlist.viewCount = newPlaylist.viewCount;
    const content = `
اسم پلی لیست:  *${playlist.name}*
↲ تعداد فایل ها: ${playlist._count.tracks}
↲ تعداد بازدید: ${playlist.viewCount}


*شما هم میتونید با ${BotInfo.NameFa} پلی لیست های خودتون رو داشته و به اشتراک بگذارید !
برای شروع /start رو بزنید*

${BotInfo.FooterMessages}
`;

    const likeCounts = await this.playlistRepo.getPlaylistLikesCount(
      playlist.id,
    );

    const tracks = await this.tracksRepo.findAll(playlist.id, 1, perPage);
    const keyboard = userPlaylistKeyboard(
      playlist.slug,
      tracks,
      likeCounts,
      page,
    );

    if (page < totalPages) {
      keyboard.push([
        {
          text: '⥱ صفحه بعدی',
          callback_data: `show_user_playlist:${playlist.slug}:${page + 1}`,
        },
      ]);
    }

    if (playlist.bannerId) {
      const bannerFile = await ctx.telegram.getFile(playlist.bannerId);
      await ctx.sendPhoto(bannerFile.file_id, {
        reply_markup: {
          inline_keyboard: keyboard,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
        parse_mode: 'Markdown',
        caption: content,
      });
    } else {
      await ctx.sendMessage(content, {
        reply_markup: {
          inline_keyboard: keyboard,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
        parse_mode: 'Markdown',
      });
    }
  }

  async onTrackPagination(ctx: Context) {
    const page = Number(ctx.match[2]) || 2;
    const perPage = 8;

    const totalCount: number = await this.tracksRepo.getCountsByPlaylistId(
      ctx.playlist.id,
    );

    const totalPages = Math.ceil(totalCount / perPage);

    const paginationKeyboard: InlineKeyboardButton[] = [];
    if (page > 1) {
      paginationKeyboard.push({
        text: '⭀ صفحه قبلی',
        callback_data: `show_user_playlist:${ctx.playlist.slug}:${page - 1}`,
      });
    }
    if (page < totalPages) {
      if (page != 1)
        paginationKeyboard.push({
          text: '🏡',
          callback_data: `show_user_playlist:${ctx.playlist.slug}:1`,
        });
      paginationKeyboard.push({
        text: '⥱ صفحه بعدی',
        callback_data: `show_user_playlist:${ctx.playlist.slug}:${page + 1}`,
      });
    }

    const files = await this.tracksRepo.findAll(ctx.playlist.id, page, perPage);
    const keyboard = userPlaylistKeyboard(
      ctx.playlist.slug,
      files,
      ctx.playlist._count.likes,
      page,
    );
    keyboard.push(paginationKeyboard);
    await ctx.editMessageReplyMarkup({
      inline_keyboard: keyboard,
    });
  }
}
