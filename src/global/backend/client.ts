import createClient from "openapi-fetch/dist/index.cjs";

import { paths } from "./apiV1/schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Pageable = {
  page?: number;
  size?: number;
  sort?: string[];
};

type QueryShape = {
  pageable?: Pageable;
  [k: string]: unknown;
};

const querySerializer = (q?: unknown): string => {
  if (q == null || typeof q !== "object") return "";
  const obj = q as QueryShape;

  const params = new URLSearchParams();

  const pg = obj.pageable;
  if (pg) {
    if (typeof pg.page === "number") params.set("page", String(pg.page));
    if (typeof pg.size === "number") params.set("size", String(pg.size));
    if (Array.isArray(pg.sort)) {
      for (const s of pg.sort) params.append("sort", s);
    }
  }

  for (const [k, v] of Object.entries(obj)) {
    if (k === "pageable" || v == null) continue;

    if (Array.isArray(v)) {
      for (const vv of v) params.append(k, String(vv));
    } else if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    ) {
      params.set(k, String(v));
    }
  }

  return params.toString();
};
const client = createClient<paths>({
  baseUrl: API_BASE_URL,
  querySerializer,
  credentials: "include",
});

export default client;
