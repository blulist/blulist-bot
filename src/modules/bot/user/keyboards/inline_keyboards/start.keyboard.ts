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
  [{ text: '📺 آموزش', callback_data: 'test' }],
];
