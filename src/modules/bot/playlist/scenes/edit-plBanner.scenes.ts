import { Ctx, Message, On, Scene, SceneEnter, Sender } from 'nestjs-telegraf';
import { Context } from '../../shared/interfaces/context.interface';
import { ManagePlaylistService } from '../services/manage-playlist.service';

@Scene('enter_your_new_banner')
export class EditPlBannerScenes {
  constructor(private playlistService: ManagePlaylistService) {}

  @SceneEnter()
  async onEnter(ctx: Context) {
    await ctx.deleteMessage();
    const msg = await ctx.sendMessage(
      'لطفا عکس بنر خود را ارسال یا فوروارد کنید:',
      {
        reply_markup: {
          inline_keyboard: [[{ text: 'لغو', callback_data: 'cancel' }]],
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ctx.scene.session.msgId = msg.message_id;
  }

  @On('photo')
  async onText(
    @Message('photo') photo: any[],
    @Ctx() ctx: Context,
    @Sender('id') senderId: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const playlistSlug = ctx.scene.session.playlistSlug;
    //  const msgId = ctx.match[2] as string;
    //

    const lastItem = photo.pop();
    await this.playlistService.editPlaylistBanner(
      ctx,
      playlistSlug,
      lastItem.file_id,
    );
  }
}
