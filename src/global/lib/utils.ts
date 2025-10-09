import { type ClassValue, clsx } from "clsx";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isValid,
} from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type InputDate = Date | number | string;
export function formatCustomDuration(start: InputDate, end: InputDate) {
  const s = toDate(start);
  const e = toDate(end);
  if (!isValid(s) || !isValid(e)) return "";

  // 음수 방지: end < start면 0 처리
  if (e.getTime() <= s.getTime()) return "1시간 이내";

  const hours = differenceInHours(e, s); // 내림(정수 시차)
  if (hours < 1) return "1시간 이내";
  if (hours <= 24) return `${hours}시간`;

  const days = differenceInDays(e, s); // 25~47h => 1일, 48~71h => 2일 ...
  return `${days}일`;
}

function toDate(d: InputDate): Date {
  return d instanceof Date ? d : new Date(d);
}

export function formatTimeAgo(input: InputDate): string {
  const now = new Date();
  const date = toDate(input);

  const sec = differenceInSeconds(now, date);
  if (sec < 5) return "방금 전";
  if (sec < 60) return `${sec}초 전`;

  const min = differenceInMinutes(now, date);
  if (min < 60) return `${min}분 전`;

  const hour = differenceInHours(now, date);
  if (hour < 24) return `${hour}시간 전`;

  const day = differenceInDays(now, date);
  if (day < 7) return `${day}일 전`;

  const abs = format(date, "yyyy.MM.dd HH:mm", { locale: ko });
  return abs; // 7일 이상은 절대 날짜
}
