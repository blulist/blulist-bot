import { Hears, Start, Update, Sender, Ctx, Command } from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { UpdateType } from '../shared/decorators/update-type.decorator';
import { Context } from '../shared/interfaces/context.interface';

@Update()
export class CommandsUpdate {
  @Start()
  async onStart(
    @Sender('first_name') firstName: string,
    @Ctx() ctx: Context,
  ): Promise<void> {
    await ctx.reply(`welcome ${firstName}`, {
      reply_markup: {
        keyboard: [
          [{ text: '➕ create playlist' }],
          [{ text: '🎶 my playlists' }],
          [{ text: '📦 explorer' }, { text: '🙂 profile' }],
        ],
        resize_keyboard: true,
        selective: true,
      },
    });
  }

  @Hears(['hi', 'hello', 'hey', 'qq'])
  onGreetings(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
  ): string {
    return `Hey ${firstName}`;
  }
}
