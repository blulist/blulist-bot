import { Injectable } from '@nestjs/common';
import { Context } from '../../shared/interfaces/context.interface';
import { PlaylistRepository } from '../playlist.repository';
import {
  Like,
  PlaylistWithTracks,
} from '../../shared/interfaces/playlist.interface';
import { playlistKeyboard } from '../keyboards/inline_keyboards/playlist.keyboard';
import { userPlaylistKeyboard } from '../../user/keyboards/inline_keyboards/userPlaylist.keyboard';

@Injectable()
export class PlaylistService {
  constructor(private playlistRepo: PlaylistRepository) {}

  async toggleLike(ctx: Context) {
    const hasExists: Like | null = await this.playlistRepo.findOneLike(
      ctx.playlist.id,
      ctx.from.id,
    );

    if (Number(ctx.playlist.ownerId) == Number(ctx.from.id)) {
      await ctx.answerCbQuery('شما نمیتونید پلی لیست خود را لایک کنیـد', {
        show_alert: true,
      });
      return;
    }

    let msg = '';
    if (hasExists) {
      // deleteLike
      await this.playlistRepo.removeLike(ctx.playlist.id, ctx.from.id);
      msg = `پلی لیست از لیست موردعلاقه شما برداشته شد.`;
    } else {
      await this.playlistRepo.addLike(ctx.playlist.id, ctx.from.id);
      msg = `❤️ پلی لیست پسندیده شد و به لیست موردعلاقه اضافه شد`;
    }

    const likeCounts = await this.playlistRepo.getPlaylistLikesCount(
      ctx.playlist.id,
    );

    await ctx.answerCbQuery(msg, { show_alert: true });
    // await ctx.editMessageReplyMarkup({
    //   inline_keyboard: userPlaylistKeyboard(
    //     ctx.playlist as PlaylistWithTracks,
    //     likeCounts,
    //   ),
    // });

    // add like
  }
}
