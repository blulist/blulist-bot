import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log(`Bot running`);
})();
