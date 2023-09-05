import { Module } from '@nestjs/common';
import { AdminUpdate } from './admin.update';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackModule } from '../track/track.module';
import { AdminBotService } from './services/admin-bot.service';

@Module({
  imports: [PlaylistModule, TrackModule],
  providers: [AdminUpdate, AdminBotService],
})
export class AdminModule {}
