import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { getBotToken } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Context } from './modules/bot/shared/interfaces/context.interface';
import { SocksProxyAgent } from 'socks-proxy-agent';
import * as https from 'https';



(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, {});
  console.log(`Bot running `);
})();
