import { Module } from '@nestjs/common';
import { ManagePlaylistUpdate } from './updates/managePlaylist.update';
import { SendPlnameScenes } from './scenes/send-plname.scenes';
import { PlaylistRepository } from './playlist.repository';
import { ManagePlaylistService } from './services/manage-playlist.service';
import { FileEvent } from './file.event';
import { TrackRepository } from './repositories/track.repository';
import { EditPlnameScenes } from './scenes/edit-plname.scenes';
import { EditPlBannerScenes } from './scenes/edit-plBanner.scenes';
import { BackHandlerUpdate } from './updates/back-handler.update';

@Module({
  providers: [
    ManagePlaylistUpdate,
    BackHandlerUpdate,
    SendPlnameScenes,
    EditPlnameScenes,
    EditPlBannerScenes,
    PlaylistRepository,
    ManagePlaylistService,
    FileEvent,
    TrackRepository,
  ],
})
export class PlaylistModule {}
