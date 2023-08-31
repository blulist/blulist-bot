import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Playlist,
  PlaylistCreateInput,
} from '../shared/interfaces/playlist.interface';

@Injectable()
export class PlaylistRepository {
  constructor(private db: PrismaService) {}

  create(input: PlaylistCreateInput): Promise<Playlist> {
    return this.db.playlist.create({ data: input });
  }
  findbySlug(slug: string): Promise<Playlist | null> {
    return this.db.playlist.findUnique({
      where: {
        slug,
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
