import { PlaylistWithCounts } from '../../shared/interfaces/playlist.interface';
import * as moment from 'moment';

export function getShowPlaylistMsg(playlist: PlaylistWithCounts): string {
  return `
اسم پلی لیست: ${playlist.name}
آیدی یونیک: <code>${playlist.slug}</code>
↲ آمار بازدید: ${playlist.viewCount}
↲ آمار لایک: ${playlist._count.likes}
↲ تعداد فایل ها: ${playlist._count.tracks}
↲ وضعیت مشاهده: ${playlist.isPrivate ? '🔐 خصوصی' : '🔓 عمومی'}
↲ ایجاد شده در: ${moment(playlist.createdAt).format('YYYY/MM/DD')}
↲ آخرین ویرایش  در: ${moment(playlist.updatedAt).format('YYYY/MM/DD')}
یک گزینه رو انتخاب کنید:
    `;
}
