import { InlineKeyboardButton } from '../../../shared/interfaces/keyboard.interface';
import { inlineCbKeys } from '../../../shared/constants/callbacks.constant';

export const playlistKeyboard = (
  playlistSlug: string,
): InlineKeyboardButton[][] => {
  return [
    [
      {
        text: '📝 ویرایش',
        callback_data: inlineCbKeys.EDIT_PLAYLIST + `:${playlistSlug}`,
      },
      {
        text: '🗃️ فایل ها',
        callback_data: inlineCbKeys.SHOW_MY_FILES + `:${playlistSlug}:1`,
      },
    ],
    [
      {
        text: '🖇️ اشتراک گذاری',
        callback_data: inlineCbKeys.SHARE_PLAYLIST + `:${playlistSlug}`,
      },
      {
        text: '🔻 حذف',
        callback_data: inlineCbKeys.DELETE_PLAYLIST + `:${playlistSlug}`,
      },
    ],
    [
      {
        text: '> بازگشت',
        callback_data: `backTo:myPlaylists`,
      },
    ],
  ];
};

export const editPlaylistKeyboard = (
  playlistSlug: string,
): InlineKeyboardButton[][] => {
  return [
    [
      {
        text: '🖼️ ویرایش بنر',
        callback_data: inlineCbKeys.EDIT_PLAYLIST_BANNER + `:${playlistSlug}`,
      },
      {
        text: '📝 ویرایش نام',
        callback_data: inlineCbKeys.EDIT_PLAYLIST_NAME + `:${playlistSlug}`,
      },
    ],
    [
      {
        text: '👀 تغییر وضعیت',
        callback_data: inlineCbKeys.TOGGLE_PLAYLIST_STATUS + `:${playlistSlug}`,
      },
    ],
    ...backToMainMenuPlaylist(playlistSlug),
  ];
};

export function backToMainMenuPlaylist(
  playlistSlug: string,
): InlineKeyboardButton[][] {
  return [
    [
      {
        text: '> بازگشت',
        callback_data: `backTo:mainPlaylist:${playlistSlug}`,
      },
    ],
  ];
}
