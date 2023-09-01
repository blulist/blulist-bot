import { forwardRef, Module } from '@nestjs/common';
import { RedisModule } from '../../redis/redis.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackRepository } from './track.repository';

const exportAndProviders = [TrackRepository];
@Module({
  imports: [RedisModule, forwardRef(() => PlaylistModule)],
  providers: [...exportAndProviders],
  exports: [...exportAndProviders],
})
export class TrackModule {}
