import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

import { SALARY_MAX_RANGE, SALARY_MIN_RANGE } from "../consts";
import { applyParams } from "../types/common.types";

interface ProjectListState {
  page: number;
  size: number;
  sort: string[];
  keyword: string;
  categoryIds: number[];
  regionIds: number[];
  skillIds: number[];
  minSalary: number;
  maxSalary: number;
}

interface ProjectListAction {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: string[]) => void;
  setKeyword: (keyword: string) => void;
  setFilter: (filter: applyParams) => void;
  reset: () => void;
}

const initState: ProjectListState = {
  page: 0,
  size: 10,
  sort: ["id,desc"],
  keyword: "",
  categoryIds: [],
  regionIds: [],
  skillIds: [],
  minSalary: SALARY_MIN_RANGE,
  maxSalary: SALARY_MAX_RANGE,
};

export const useProjectListStore = create(
  devtools(
    combine(
      initState,
      (set): ProjectListAction => ({
        setPage: (page) => set({ page }),
        setSize: (size) => set({ size }),
        setSort: (sort) => set({ sort, page: 0 }),
        setKeyword: (keyword) => set({ keyword }),
        setFilter: (filter) => set({ ...filter }),
        reset: () => set(initState),
      }),
    ),
  ),
);
