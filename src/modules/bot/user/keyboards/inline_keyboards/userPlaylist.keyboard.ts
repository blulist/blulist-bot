import { InlineKeyboardButton } from '../../../shared/interfaces/keyboard.interface';
import { Track } from '../../../shared/interfaces/track.interface';

export const userPlaylistKeyboard = (
  playlistSlug: string,
  tracks: Array<Track>,
  likeCounts: number,
  currentPage: number,
): InlineKeyboardButton[][] => {
  const files: InlineKeyboardButton[][] = tracks.map((tr) => [
    {
      text: `${tr.title} • ${tr.performer}`,
      callback_data: `selectTrack:${playlistSlug}:${tr.uniqueId}`,
    },
  ]);
  if (tracks.length) {
    files.unshift([
      {
        text: '📤 آپلود همه فایلها',
        callback_data: `sendAllTracks:${playlistSlug}:${currentPage}`,
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
        callback_data: `likePlaylist:${playlistSlug}`,
      },
    ],

    ...files,
  ];

  return buttons;
};
