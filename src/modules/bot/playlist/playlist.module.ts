import { Module } from '@nestjs/common';
import { PlaylistUpdate } from './playlist.update';
import { SendPlnameScenes } from './scenes/send-plname.scenes';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistService } from './playlist.service';
import { AudioEvent } from './audio.event';
import { TrackRepository } from './repositories/track.repository';

@Module({
  providers: [
    PlaylistUpdate,
    SendPlnameScenes,
    PlaylistRepository,
    PlaylistService,
    AudioEvent,
    TrackRepository,
  ],
})
export class PlaylistModule {}
