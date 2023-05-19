import { Module } from '@nestjs/common';
import { AudioEvent } from './audio.event';

@Module({
  providers: [AudioEvent],
})
export class EventsModule {}
