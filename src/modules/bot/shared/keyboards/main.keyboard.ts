import { InlineKeyboardButton } from '../interfaces/keyboard.interface';
import { inlineCbKeys } from '../constants/callbacks.constant';

export const mainMenuInlineKeyboards: InlineKeyboardButton[][] = [
  [
    {
      text: '🗃️ پلی لیست های من',
      callback_data: inlineCbKeys.MY_PLAYLISTS + ':1',
    },
    {
      text: '⚙️ ساخت پلی لیست',
      callback_data: inlineCbKeys.CREATE_PLAYLIST,
    },
  ],
  [{ text: '🔎 اکسپلور', callback_data: 'soon' }],
  [
    { text: 'کانال ما', url: 'https://t.me/blulist_support' },
    { text: '❤️ پسندیدها', callback_data: 'soon' },
  ],
  [
    { text: '🌐 وب اپلیکیشن', url: 'https://bluelist.ir' },
    { text: '📺 آموزش', callback_data: 'soon' },
  ],
];
