import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

import { ApplicationStatus } from "../types/application.types";

interface ReceivedAppListState {
  page: number;
  size: number;
  sort: string[];
  status: ApplicationStatus;
}

interface ReceivedAppListAction {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: string[]) => void;
  setStatus: (status: ApplicationStatus) => void;
  reset: () => void;
}

const initState: ReceivedAppListState = {
  page: 0,
  size: 20,
  sort: ["id,desc"],
  status: undefined,
};

export const useReceivedAppListStore = create(
  devtools(
    combine(
      initState,
      (set): ReceivedAppListAction => ({
        setPage: (page) => set({ page }),
        setSize: (size) => set({ size }),
        setSort: (sort) => set({ sort, page: 0 }),
        setStatus: (status) => set({ status }),
        reset: () => set(initState),
      }),
    ),
  ),
);
