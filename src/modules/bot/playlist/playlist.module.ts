import { Module } from '@nestjs/common';
import { ManagePlaylistUpdate } from './managePlaylist.update';
import { SendPlnameScenes } from './scenes/send-plname.scenes';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistService } from './playlist.service';
import { FileEvent } from './file.event';
import { TrackRepository } from './repositories/track.repository';
import { EditPlnameScenes } from './scenes/edit-plname.scenes';
import { EditPlBannerScenes } from './scenes/edit-plBanner.scenes';

@Module({
  providers: [
    ManagePlaylistUpdate,
    SendPlnameScenes,
    EditPlnameScenes,
    EditPlBannerScenes,
    PlaylistRepository,
    PlaylistService,
    FileEvent,
    TrackRepository,
  ],
})
export class PlaylistModule {}
