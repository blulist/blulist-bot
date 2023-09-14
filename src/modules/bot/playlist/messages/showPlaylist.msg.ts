import { PlaylistWithCounts } from '../../shared/interfaces/playlist.interface';
import * as moment from 'moment';
import { BotInfo } from '../../shared/constants/bot.constant';

export function getShowPlaylistMsg(playlist: PlaylistWithCounts): string {
  return `
اسم پلی لیست: *${playlist.name}*
↲ آمار بازدید: ${playlist.viewCount}
↲ آمار لایک: ${playlist._count.likes}
↲ تعداد فایل ها: ${playlist._count.tracks}
↲ وضعیت مشاهده: ${playlist.isPrivate ? '🔐 خصوصی' : '🔓 عمومی'}
↲ ایجاد شده در: ${moment(playlist.createdAt).format('YYYY/MM/DD')}
↲ آخرین ویرایش  در: ${moment(playlist.updatedAt).format('YYYY/MM/DD')}
یک گزینه رو انتخاب کنید:
    `;
}

export function getErrorValidatePlaylistName(): string {
  return `• خطا در ذخیره سازی
نام انتخابی شما یکی از قوانین زیر رو نقض کرده است:

1. بیشتر از 30 کلمه
2. حاوی کلمات نامناسب
3. تزریق کدهای مخرب

لطفا بعد از بررسی مجدد ارسال کنید.
${BotInfo.FooterMessages}`;
}
