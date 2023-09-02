import { InlineKeyboardButton } from '../../../shared/interfaces/keyboard.interface';
import { PlaylistWithTracks } from '../../../shared/interfaces/playlist.interface';

export const userPlaylistKeyboard = (
  playlist: PlaylistWithTracks,
  likeCounts: number,
): InlineKeyboardButton[][] => {
  const files: InlineKeyboardButton[][] = playlist.tracks.map((tr) => [
    {
      text: `${tr.title} • ${tr.performer}`,
      callback_data: `selectTrack:${playlist.slug}:${tr.uniqueId}`,
    },
  ]);
  if (playlist.tracks.length) {
    files.unshift([
      {
        text: '📤 آپلود همه فایلها',
        callback_data: `sendAllTracks:${playlist.slug}`,
      },
    ]);
  }
  const buttons = [
    [
      {
        text: `🛡️ گزارش`,
        callback_data: `soon`,
      },
      {
        text: `❤️ ${likeCounts}`,
        callback_data: `likePlaylist:${playlist.slug}`,
      },
    ],

    ...files,
  ];

  return buttons;
};
