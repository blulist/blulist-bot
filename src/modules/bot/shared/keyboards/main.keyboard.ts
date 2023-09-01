import { InlineKeyboardButton } from '../interfaces/keyboard.interface';
import { inlineCbKeys } from '../constants/callbacks.constant';

export const mainMenuInlineKeyboards: InlineKeyboardButton[][] = [
  [
    { text: '🗃️ پلی لیست های من', callback_data: inlineCbKeys.MY_PLAYLISTS },
    {
      text: '⚙️ ساخت پلی لیست',
      callback_data: inlineCbKeys.CREATE_PLAYLIST,
    },
  ],
  [{ text: '🔎 اکسپلور', callback_data: 'explore' }],
  [
    { text: 'گیت هاب', url: 'https://github.com/sajjadmrx' },
    { text: '📺 آموزش', callback_data: 'test' },
  ],
];
