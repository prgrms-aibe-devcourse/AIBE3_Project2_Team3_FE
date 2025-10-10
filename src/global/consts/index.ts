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
