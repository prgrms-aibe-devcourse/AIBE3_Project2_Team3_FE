import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

interface MyProjectListState {
  page: number;
  size: number;
  sort: string[];
}

interface MyProjectListAction {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: string[]) => void;
  reset: () => void;
}

const initState: MyProjectListState = {
  page: 0,
  size: 20,
  sort: ["id,desc"],
};

export const useMyProjectListStore = create(
  devtools(
    combine(
      initState,
      (set): MyProjectListAction => ({
        setPage: (page) => set({ page }),
        setSize: (size) => set({ size }),
        setSort: (sort) => set({ sort, page: 0 }),
        reset: () => set(initState),
      }),
    ),
  ),
);
