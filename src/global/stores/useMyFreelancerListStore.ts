import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

interface MyFreelancerListState {
  page: number;
  size: number;
  sort: string[];
}

interface MyFreelancerListAction {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: string[]) => void;
  reset: () => void;
}

const initState: MyFreelancerListState = {
  page: 0,
  size: 20,
  sort: ["id,desc"],
};

export const useMyFreelancerListStore = create(
  devtools(
    combine(
      initState,
      (set): MyFreelancerListAction => ({
        setPage: (page) => set({ page }),
        setSize: (size) => set({ size }),
        setSort: (sort) => set({ sort, page: 0 }),
        reset: () => set(initState),
      }),
    ),
  ),
);
