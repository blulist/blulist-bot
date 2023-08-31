import { Module } from '@nestjs/common';
import { PlaylistUpdate } from './playlist.update';
import { SendPlnameScenes } from './scenes/send-plname.scenes';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistService } from './playlist.service';

@Module({
  providers: [
    PlaylistUpdate,
    SendPlnameScenes,
    PlaylistRepository,
    PlaylistService,
  ],
})
export class PlaylistModule {}
