import { Injectable } from '@nestjs/common';
import { Context } from '../../shared/interfaces/context.interface';
import { PlaylistRepository } from '../../playlist/playlist.repository';
import { PlaylistWithTracks } from '../../shared/interfaces/playlist.interface';
import { userPlaylistKeyboard } from '../keyboards/inline_keyboards/userPlaylist.keyboard';
import { BotInfo } from '../../shared/constants/bot.constant';

@Injectable()
export class UserService {
  constructor(private playlistRepo: PlaylistRepository) {}

  async showUserPlaylist(ctx: Context, targetSlug: string, ref: string) {
    const playlist: PlaylistWithTracks | null =
      (await this.playlistRepo.findbySlug(
        targetSlug,
        true,
      )) as PlaylistWithTracks | null;

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

    const newPlaylist = await this.playlistRepo.updateViewCount(playlist.slug);
    playlist.viewCount = newPlaylist.viewCount;
    const content = `
اسم پلی لیست:  <b>${playlist.name}</b>
آیدی یونیک: <code>${playlist.slug}</code>
↲ تعداد محتوا: ${playlist.tracks.length}
↲ تعداد بازدید: ${playlist.viewCount}


<b>شما هم میتونید با ${BotInfo.NameFa} پلی لیست های خودتون رو داشته و به اشتراک بگذارید !
برای شروع /start رو بزنید</b>

${BotInfo.FooterMessages}
`;

    const likeCounts = await this.playlistRepo.getPlaylistLikesCount(
      playlist.id,
    );
    if (playlist.bannerId) {
      const bannerFile = await ctx.telegram.getFile(playlist.bannerId);
      await ctx.sendPhoto(bannerFile.file_id, {
        reply_markup: {
          inline_keyboard: userPlaylistKeyboard(playlist, likeCounts),
          resize_keyboard: true,
        },
        parse_mode: 'HTML',
        caption: content,
      });
    } else {
      await ctx.sendMessage(content, {
        reply_markup: {
          inline_keyboard: userPlaylistKeyboard(playlist, likeCounts),
          resize_keyboard: true,
        },
        parse_mode: 'HTML',
      });
    }
  }
}
