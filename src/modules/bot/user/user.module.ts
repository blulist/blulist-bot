import { Module } from '@nestjs/common';
import { UserUpdate } from './user.update';
import { UserService } from './services/user.service';
import { PlaylistModule } from '../playlist/playlist.module';

@Module({
  imports: [PlaylistModule],
  providers: [UserUpdate, UserService],
})
export class UserModule {}
