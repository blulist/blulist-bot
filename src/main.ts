import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, {});
  await app.listen(4000);
  console.log(`Bot running `);
})();
