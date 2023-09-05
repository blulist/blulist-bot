import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private bot: Telegraf<Context>) {}

  async getFileUrl(file_id: string): Promise<string> {
    const file = await this.bot.telegram.getFileLink(file_id);
    return file.href;
  }
}
