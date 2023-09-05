import { Scenes } from 'telegraf';
import { Playlist, PlaylistWithTracks } from './playlist.interface';
import { User } from './user.interface';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Scenes.SceneContext {
  match: Array<string>;
  playlist: Playlist | PlaylistWithTracks;
  startPayload: string | undefined;
  user: User;
}
