import { Ctx, Update, On, Message } from 'nestjs-telegraf';

import { Context } from '../shared/interfaces/context.interface';

@Update()
export class AudioEvent {
  @On('audio')
  async onSendAudio(@Ctx() ctx: Context, @Message('audio') audio: any) {
    const fileUrl = await ctx.telegram.getFileLink(audio.file_id);
    console.log(audio, fileUrl);
    // await ctx.reply(`uploading... ${audio.title}`);
    // await ctx.sendChatAction('upload_document');
    // await ctx.sendAudio({ url: fileUrl.href }, { caption: audio.title });
  }
}
