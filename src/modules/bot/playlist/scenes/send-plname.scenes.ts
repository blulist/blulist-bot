import { Ctx, Message, On, Scene, Sender } from 'nestjs-telegraf';
import { Context } from '../../shared/interfaces/context.interface';
import { ManagePlaylistService } from '../services/manage-playlist.service';

@Scene('send_playlist_name')
export class SendPlnameScenes {
  constructor(private playlistService: ManagePlaylistService) {}

  @On('text')
  async onText(
    @Message('text') playlistName: string,
    @Ctx() ctx: Context,
    @Sender('id') senderId: number,
  ) {
    await this.playlistService.create(ctx, { playlistName, senderId });
  }
}
