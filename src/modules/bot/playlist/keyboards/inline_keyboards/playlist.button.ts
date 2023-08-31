import { InlineKeyboardButton } from '../../../shared/interfaces/keyboard.interface';
import { inlineCbKeys } from '../../../shared/constants/callbacks.constant';

export const playlistButton: InlineKeyboardButton[][] = [
  [
    { text: '📝 ویرایش نام', callback_data: inlineCbKeys.EDIT_PLAYLIST_NAME },
    { text: '➕ اضافه کردن موزیک', callback_data: inlineCbKeys.ADD_MUSIC },
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
