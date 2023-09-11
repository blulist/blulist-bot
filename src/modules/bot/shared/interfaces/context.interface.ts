import { Scenes } from 'telegraf';
import { Playlist, PlaylistWithCounts } from './playlist.interface';
import { User } from './user.interface';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Scenes.SceneContext {
  match: Array<string>;
  playlist: PlaylistWithCounts;
  startPayload: string | undefined;
  user: User;
}
