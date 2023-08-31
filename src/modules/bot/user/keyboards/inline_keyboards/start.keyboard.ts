import { InlineKeyboardButton } from '../../../shared/interfaces/keyboard.interface';
import { inlineCbKeys } from '../../../shared/constants/callbacks.constant';

export const startKeyboard: InlineKeyboardButton[][] = [
  [
    { text: '🗃️ پلی لیست های من', callback_data: 'test' },
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
