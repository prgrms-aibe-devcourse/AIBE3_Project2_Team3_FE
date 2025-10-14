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

import {
  DEFAULT_FEE_MIN,
  DEFAULT_FEE_RATE,
  DEFAULT_FEE_ROUNDING,
  Rounding,
} from "../consts";
import { UnitOption } from "../types/common.types";

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

export function toUnit(unitOption: UnitOption[], amount: number, unit: string) {
  const f = unitOption.find((o) => o.value === unit)!.factor;
  if (!f) return null;
  return amount * f;
}

export function fromUnit(
  unitOption: UnitOption[],
  total: number,
  unit: string,
) {
  const f = unitOption.find((o) => o.value === unit)!.factor;
  if (!f) return null;
  return Math.trunc(total / f);
}

export function formatChatTimestamp(input?: string | number | Date) {
  if (!input) return "";
  const d = new Date(input);

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  // 오늘
  if (startOfD.getTime() === startOfToday.getTime()) {
    // 오전/오후 hh:mm (예: "오전 12:05")
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  }

  // 어제
  if (startOfD.getTime() === startOfYesterday.getTime()) {
    return "어제";
  }

  // 그 외: YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatChatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function toLocalDateTimeString(d: Date) {
  return format(d, "yyyy-MM-dd'T'HH:mm:ss");
}

export function calcFee(
  amount: number,
  opts?: { rate?: number; min?: number; rounding?: Rounding },
): number {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("amount must be a non-negative finite number");
  }
  if (amount === 0) return 0;

  const rate = opts?.rate ?? DEFAULT_FEE_RATE;
  const min = opts?.min ?? DEFAULT_FEE_MIN;
  const rounding = opts?.rounding ?? DEFAULT_FEE_ROUNDING;

  const raw = amount * rate;
  const rounded =
    rounding === "ceil"
      ? Math.ceil(raw)
      : rounding === "floor"
        ? Math.floor(raw)
        : Math.round(raw);

  return Math.max(rounded, min);
}

export function calcTotals(
  items: { price: number; qty: number }[],
  opts?: { rate?: number; min?: number; rounding?: Rounding },
) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const fee = calcFee(subtotal, opts);
  const total = subtotal + fee;
  return { subtotal, fee, total };
}

export function computeStep(minBound: number, maxBound: number) {
  const range = Math.max(0, maxBound - minBound);
  if (range <= 1_000_000) return 10_000; // 1백만 이하면 1만
  if (range <= 5_000_000) return 50_000; // 5백만 이하면 5만
  if (range <= 20_000_000) return 100_000; // 2천만 이하면 10만
  return 500_000; // 그 이상은 50만
}

export const clamp = (n: number, lo: number, hi: number) =>
  Math.min(Math.max(n, lo), hi);
export const roundTo = (n: number, step: number) => Math.round(n / step) * step;
