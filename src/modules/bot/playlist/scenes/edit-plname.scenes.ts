import { Ctx, Message, On, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Context } from '../../shared/interfaces/context.interface';
import { PlaylistService } from '../playlist.service';

@Scene('enter_your_new_name')
export class EditPlnameScenes {
  constructor(private playlistService: PlaylistService) {}

  @SceneEnter()
  async onEnter(ctx: Context) {
    await ctx.editMessageText('لطفا نام جدید رو ارسال کنید:', {
      reply_markup: {
        inline_keyboard: [[{ text: 'لغو', callback_data: 'cancel' }]],
      },
    });
  }

  @On('text')
  async onText(
    @Message('text') playlistName: string,
    @Ctx() ctx: Context,
    @Sender('id') senderId: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const playlistSlug = ctx.scene.session.playlistSlug;
    //  const msgId = ctx.match[2] as string;

    await this.playlistService.editPlaylistName(
      ctx,
      playlistSlug,
      playlistName,
    );

    // await ctx.deleteMessage(msgId)
  }
}
