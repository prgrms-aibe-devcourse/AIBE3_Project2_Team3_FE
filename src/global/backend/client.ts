import createClient from "openapi-fetch/dist/index.cjs";

import { paths } from "./apiV1/schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const querySerializer = (q?: Record<string, any>) => {
  const params = new URLSearchParams();
  if (!q) return "";
  const pg = q.pageable as
    | { page?: number; size?: number; sort?: string[] }
    | undefined;
  if (pg) {
    if (pg.page != null) params.set("page", String(pg.page));
    if (pg.size != null) params.set("size", String(pg.size));
    if (Array.isArray(pg.sort))
      pg.sort.forEach((s) => params.append("sort", s));
  }
  for (const [k, v] of Object.entries(q)) {
    if (k === "pageable" || v == null) continue;
    if (Array.isArray(v)) v.forEach((vv) => params.append(k, String(vv)));
    else if (typeof v !== "object") params.set(k, String(v));
  }

  return params.toString();
};

const client = createClient<paths>({
  baseUrl: API_BASE_URL,
  querySerializer,
  credentials: "include",
});

export default client;
