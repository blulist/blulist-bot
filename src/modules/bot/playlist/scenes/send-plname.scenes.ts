import { Ctx, Message, On, Scene, SceneLeave } from 'nestjs-telegraf';
import { Context } from '../../shared/interfaces/context.interface';
import { playlistButton } from '../keyboards/inline_keyboards/playlist.button';

@Scene('send_playlist_name')
export class SendPlnameScenes {
  @SceneLeave()
  onLave() {
    console.log('Laved');
  }

  @On('text')
  async onText(@Message('text') playlistName: string, @Ctx() ctx: Context) {
    await ctx.reply(
      `• پلی لیست به نام **${playlistName}**  و ایدی ${1} ساخته شد.`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: playlistButton,
          selective: true,
          one_time_keyboard: true,
        },
      },
    );
    await ctx.scene.leave();
  }
}
