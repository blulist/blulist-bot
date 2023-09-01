import { forwardRef, Module } from '@nestjs/common';
import { RedisModule } from '../../redis/redis.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackRepository } from './track.repository';
import { TrackUpdate } from './updates/track.update';
import { TrackService } from './services/track.service';
import { ManageTrackUpdate } from './updates/manage-track.update';
import { ManageTrackService } from './services/manage-track.service';

const exportAndProviders = [TrackRepository];
@Module({
  imports: [RedisModule, forwardRef(() => PlaylistModule)],
  providers: [
    ...exportAndProviders,
    TrackUpdate,
    TrackService,
    ManageTrackUpdate,
    ManageTrackService,
  ],
  exports: [...exportAndProviders],
})
export class TrackModule {}
