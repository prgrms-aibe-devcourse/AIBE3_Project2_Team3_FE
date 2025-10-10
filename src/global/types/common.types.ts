import { components } from "../backend/apiV1/schema";

export type Pageable = components["schemas"]["Pageable"];
export type UnitOption = { value: string; label: string; factor: number };
