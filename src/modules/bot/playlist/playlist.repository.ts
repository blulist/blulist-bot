import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Playlist,
  PlaylistCreateInput,
  PlaylistUpdateInput,
  PlaylistWithTracks,
} from '../shared/interfaces/playlist.interface';

@Injectable()
export class PlaylistRepository {
  constructor(private db: PrismaService) {}

  create(input: PlaylistCreateInput): Promise<Playlist> {
    return this.db.playlist.create({ data: input });
  }
  findbySlug(
    slug: string,
    inclueTracks = false,
  ): Promise<PlaylistWithTracks | null> {
    return this.db.playlist.findUnique({
      where: {
        slug,
      },
      include: {
        tracks: inclueTracks,
      },
    });
  }

  async updateBySlug(slug: string, input: PlaylistUpdateInput) {
    return this.db.playlist.update({
      where: {
        slug,
      },
      data: input,
      include: {
        tracks: true,
      },
    });
  }
  findAllAUser(userId: number): Promise<Array<Playlist>> {
    return this.db.playlist.findMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
