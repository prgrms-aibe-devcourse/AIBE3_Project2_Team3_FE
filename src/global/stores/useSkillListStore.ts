import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

interface SkillListState {
  page: number;
  size: number;
  sort: string[];
  search: string;
}

interface SkillListAction {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: string[]) => void;
  setSearch: (search: string) => void;
  reset: () => void;
}

const initState: SkillListState = {
  page: 0,
  size: 100,
  sort: ["id,desc"],
  search: "",
};

export const useSkillListStore = create(
  devtools(
    combine(
      initState,
      (set): SkillListAction => ({
        setPage: (page) => set({ page }),
        setSize: (size) => set({ size }),
        setSort: (sort) => set({ sort, page: 0 }),
        setSearch: (search) => set({ search }),
        reset: () => set(initState),
      }),
    ),
  ),
);
