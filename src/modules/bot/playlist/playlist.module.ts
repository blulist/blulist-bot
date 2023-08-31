import { Module } from '@nestjs/common';
import { PlaylistUpdate } from './playlist.update';
import { SendPlnameScenes } from './scenes/send-plname.scenes';

@Module({
  providers: [PlaylistUpdate, SendPlnameScenes],
})
export class PlaylistModule {}
