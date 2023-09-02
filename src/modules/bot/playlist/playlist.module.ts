import { forwardRef, Module } from '@nestjs/common';
import { ManagePlaylistUpdate } from './updates/managePlaylist.update';
import { SendPlnameScenes } from './scenes/send-plname.scenes';
import { PlaylistRepository } from './playlist.repository';
import { ManagePlaylistService } from './services/manage-playlist.service';
import { FileEvent } from '../track/file.event';
import { TrackRepository } from '../track/track.repository';
import { EditPlnameScenes } from './scenes/edit-plname.scenes';
import { EditPlBannerScenes } from './scenes/edit-plBanner.scenes';
import { BackAndCancelHandlerUpdate } from './updates/back-and-cancel-handler.update';
import { TrackModule } from '../track/track.module';
import { DeletePlaylistScene } from './scenes/delete-playlist.scene';
import { PlaylistUpdate } from './updates/playlist.update';
import { PlaylistService } from './services/playlist.service';

const exportAndProviders = [PlaylistRepository];
@Module({
  imports: [forwardRef(() => TrackModule)],
  providers: [
    ManagePlaylistUpdate,
    ManagePlaylistService,
    BackAndCancelHandlerUpdate,
    SendPlnameScenes,
    EditPlnameScenes,
    DeletePlaylistScene,
    PlaylistUpdate,
    PlaylistService,
    EditPlBannerScenes,
    FileEvent,
    ...exportAndProviders,
  ],
  exports: [...exportAndProviders],
})
export class PlaylistModule {}
