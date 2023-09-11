import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Like,
  Playlist,
  PlaylistCreateInput,
  PlaylistUpdateInput,
  PlaylistWithCounts,
} from '../shared/interfaces/playlist.interface';

@Injectable()
export class PlaylistRepository {
  constructor(private db: PrismaService) {}

  create(input: PlaylistCreateInput): Promise<Playlist> {
    return this.db.playlist.create({ data: input });
  }
  findBySlug(
    slug: string,
    includeCounts = false,
  ): Promise<Playlist | PlaylistWithCounts | null> {
    return this.db.playlist.findUnique({
      where: {
        slug,
      },
      include: {
        tracks: includeCounts,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }

  async updateBySlug(slug: string, input: PlaylistUpdateInput) {
    return this.db.playlist.update({
      where: {
        slug,
      },
      data: input,
    });
  }
  findAllByUserId(
    userId: number,
    page: number,
    perPage = 10,
  ): Promise<Array<Playlist>> {
    return this.db.playlist.findMany({
      where: {
        ownerId: userId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getCountsByUserId(userId: number): Promise<number> {
    return this.db.playlist.count({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateViewCount(playlistSlug: string) {
    return this.db.playlist.update({
      where: {
        slug: playlistSlug,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async deleteOneBySlug(slug: string) {
    return this.db.playlist.delete({ where: { slug } });
  }

  addLike(playlistId: number, userId: number): Promise<Like> {
    return this.db.like.create({
      data: {
        playlistId: playlistId,
        userId: userId,
      },
    });
  }

  getPlaylistLikesCount(playlistId: number) {
    return this.db.like.count({
      where: {
        playlistId: playlistId,
      },
    });
  }

  getAllPlaylistCount(isPrivate: boolean | null = null) {
    if (isPrivate === null) return this.db.playlist.count({});
    else
      return this.db.playlist.count({
        where: {
          isPrivate: isPrivate,
        },
      });
  }

  async getTodayPlaylistCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day
    const count = await this.db.playlist.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });
    return count;
  }

  removeLike(playlistId: number, userId: number): Promise<Like> {
    return this.db.like.delete({
      where: {
        playlistId_userId: {
          playlistId: playlistId,
          userId: userId,
        },
      },
    });
  }

  findOneLike(playlistId: number, userId: number): Promise<Like | null> {
    return this.db.like.findUnique({
      where: {
        playlistId_userId: {
          playlistId: playlistId,
          userId: userId,
        },
      },
    });
  }
}
