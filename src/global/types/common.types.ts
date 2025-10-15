import { components } from "../backend/apiV1/schema";

export type Pageable = components["schemas"]["Pageable"];
export type UnitOption = { value: string; label: string; factor: number };
export type PageQuery = {
  page?: number; // 0-base
  size?: number; // ex) 100
  sort?: string[]; // ex) ["id,desc", "name,asc"]
};

export type applyParams = {
  categoryIds: number[];
  regionIds: number[];
  skillIds: number[];
  minSalary: number;
  maxSalary: number;
};

export type ExistingFile = { id: number; url: string; fileName: string };
