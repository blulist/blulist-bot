import { InlineKeyboardButton } from '../../../shared/interfaces/keyboard.interface';

export const playlistButton: InlineKeyboardButton[][] = [
  [
    { text: 'ویرایش نام', callback_data: 'edit_playlist_name' },
    { text: 'اضافه کردن موزیک', callback_data: 'add_music' },
  ],
  [
    {
      text: 'اشتراک گذاری',
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
