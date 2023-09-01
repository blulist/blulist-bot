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

  findAll(playlistId: number): Promise<Array<Track>> {
    return this.db.track.findMany({
      where: {
        playlistId,
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
  deleteOneByUniqueId(uniqueId: string): Promise<Track> {
    return this.db.track.delete({
      where: { uniqueId },
    });
  }
}
