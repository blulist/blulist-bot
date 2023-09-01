import { Playlist as _Playlist, Prisma } from '@prisma/client';
import { Track } from './track.interface';

export type Playlist = _Playlist;
export type PlaylistWithTracks = Playlist & {
  tracks: Track[];
};
export type PlaylistCreateInput = Omit<Prisma.PlaylistCreateInput, 'owner'> & {
  ownerId: number;
};

export type PlaylistUpdateInput = Prisma.PlaylistUpdateInput;
