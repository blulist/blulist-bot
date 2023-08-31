import { Prisma, Track as _Track } from '@prisma/client';

export type Track = _Track;

export type TrackCreateInput = Omit<
  Prisma.TrackCreateInput,
  'playlist' | 'addedBy'
> & {
  playlistId: number;
  addedById: number;
};
