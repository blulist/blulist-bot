import { Scenes } from 'telegraf';
import { Playlist, PlaylistWithTracks } from './playlist.interface';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Scenes.SceneContext {
  match: Array<string>;
  playlist: Playlist | PlaylistWithTracks;
}
