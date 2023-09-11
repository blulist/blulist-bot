import { Module } from '@nestjs/common';
import { UserUpdate } from './user.update';
import { UserService } from './services/user.service';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [PlaylistModule, TrackModule],
  providers: [UserUpdate, UserService],
})
export class UserModule {}
