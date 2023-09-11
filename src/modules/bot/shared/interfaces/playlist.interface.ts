import { Playlist as _Playlist, Prisma, Like as _like } from '@prisma/client';
import { Track } from './track.interface';

export type Playlist = _Playlist;
export type PlaylistWithCounts = Playlist & {
  _count: {
    likes: number;
    tracks: number;
  };
};

export type PlaylistCreateInput = Omit<Prisma.PlaylistCreateInput, 'owner'> & {
  ownerId: number;
};

export type PlaylistUpdateInput = Prisma.PlaylistUpdateInput;

export type Like = _like;
