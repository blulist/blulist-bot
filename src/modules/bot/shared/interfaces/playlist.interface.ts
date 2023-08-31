import { Playlist as _Playlist, Prisma } from '@prisma/client';

export type Playlist = _Playlist;

export type PlaylistCreateInput = Omit<Prisma.PlaylistCreateInput, 'owner'> & {
  ownerId: number;
};
