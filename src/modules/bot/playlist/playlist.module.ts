import { Module } from '@nestjs/common';
import { PlaylistUpdate } from './playlist.update';
import { SendPlnameScenes } from './scenes/send-plname.scenes';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistService } from './playlist.service';
import { FileEvent } from './file.event';
import { TrackRepository } from './repositories/track.repository';
import { EditPlnameScenes } from './scenes/edit-plname.scenes';

@Module({
  providers: [
    PlaylistUpdate,
    SendPlnameScenes,
    EditPlnameScenes,
    PlaylistRepository,
    PlaylistService,
    FileEvent,
    TrackRepository,
  ],
})
export class PlaylistModule {}
