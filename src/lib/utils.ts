import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(isoString: string, lang: string = 'lo'): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    if (lang === 'lo') return 'ມື້ກີ້ນີ້';
    if (lang === 'th') return 'เมื่อสักครู่';
    if (lang === 'zh') return '刚刚';
    if (lang === 'vi') return 'Vừa xong';
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    if (lang === 'lo') return `${diffInMinutes} ນາທີກ່ອນ`;
    if (lang === 'th') return `${diffInMinutes} นาทีที่แล้ว`;
    if (lang === 'zh') return `${diffInMinutes} 分钟前`;
    if (lang === 'vi') return `${diffInMinutes} phút trước`;
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    if (lang === 'lo') return `${diffInHours} ຊົ່ວໂມງກ່ອນ`;
    if (lang === 'th') return `${diffInHours} ชั่วโมงที่แล้ว`;
    if (lang === 'zh') return `${diffInHours} 小时前`;
    if (lang === 'vi') return `${diffInHours} giờ trước`;
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    if (lang === 'lo') return `${diffInDays} ມື້ກ່ອນ`;
    if (lang === 'th') return `${diffInDays} วันที่แล้ว`;
    if (lang === 'zh') return `${diffInDays} 天前`;
    if (lang === 'vi') return `${diffInDays} ngày trước`;
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
