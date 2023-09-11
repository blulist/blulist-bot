import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Track, TrackCreateInput } from '../shared/interfaces/track.interface';

@Injectable()
export class TrackRepository {
  constructor(private db: PrismaService) {}

  create(input: TrackCreateInput): Promise<Track> {
    return this.db.track.create({
      data: input,
    });
  }

  findAll(
    playlistId: number,
    page: number,
    perPage: number,
  ): Promise<Array<Track>> {
    return this.db.track.findMany({
      where: {
        playlistId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  findOneByUniqueId(uniqueId: string): Promise<Track> {
    return this.db.track.findUnique({
      where: {
        uniqueId,
      },
    });
  }

  getCountsByPlaylistId(playlistId: number): Promise<number> {
    return this.db.track.count({
      where: {
        playlistId,
      },
    });
  }

  deleteOneByUniqueId(uniqueId: string): Promise<Track> {
    return this.db.track.delete({
      where: { uniqueId },
    });
  }
}
