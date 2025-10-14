export const HOUR_TO_MILLES = 60 * 60 * 1000;
export const DAY_TO_MILLES = 24 * HOUR_TO_MILLES;
export const WEEK_TO_MILLES = 7 * DAY_TO_MILLES;

export const TIME_UNITS = [
  { value: "hour", label: "시간", factor: HOUR_TO_MILLES },
  { value: "day", label: "일", factor: DAY_TO_MILLES },
  { value: "week", label: "주", factor: WEEK_TO_MILLES },
];

export const SALARY_UNITS = [
  { value: "krw", label: "원", factor: 1 },
  { value: "krw_1k", label: "천원", factor: 1_000 },
  { value: "krw_10k", label: "만원", factor: 10_000 },
];

export const SALARY_MIN_RANGE = 0;
export const SALARY_MAX_RANGE = 100_000_000;

export type ExperienceRange = {
  id: string;
  label: string;
  min: number; // 포함
  max?: number; // 미포함 (없으면 상한 없음)
  level: number;
};

export const EXPERIENCE_OPTIONS: ExperienceRange[] = [
  { id: "rookie", label: "0–1년 (루키/주니어)", min: 0, max: 1, level: 1 },
  { id: "junior", label: "1–3년 (주니어)", min: 1, max: 3, level: 2 },
  { id: "middle", label: "3–6년 (미들)", min: 3, max: 6, level: 3 },
  { id: "senior", label: "6–10년 (시니어)", min: 6, max: 10, level: 4 },
  { id: "lead", label: "10년 이상 (리드+)", min: 10, level: 5 },
];

export type Rounding = "ceil" | "floor" | "round";
export const DEFAULT_FEE_RATE = 0.03; // 3.5%
export const DEFAULT_FEE_MIN = 900; // 최소 900원
export const DEFAULT_FEE_ROUNDING: Rounding = "ceil"; // 소수 발생 시 올림 권장

export const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/join",
  "/",
  "/projects",
  "/freelancers",
];
