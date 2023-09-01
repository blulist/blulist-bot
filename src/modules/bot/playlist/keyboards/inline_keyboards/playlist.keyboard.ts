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
        text: '➕ اضافه کردن ادمین',
        callback_data: inlineCbKeys.ADD_MUSIC + `:${playlistSlug}`,
      },
    ],
    [
      {
        text: '🖇️ اشتراک گذاری',
        callback_data: 'shere_playlist',
      },
      {
        text: 'آمار',
        callback_data: 'amar_playlist',
      },
    ],
    [
      {
        text: '🗑️ حذف',
        callback_data: 'delete_playlist',
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
        callback_data: 'test',
      },
    ],
    [{ text: '> بازگشت', callback_data: 'back:show_playlist:xx' }],
  ];
};
