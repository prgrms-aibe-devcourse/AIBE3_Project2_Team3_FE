import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

interface ChatMessageListState {
  page: number;
  size: number;
  sort: string[];
  search: string;
}

interface ChatMessageListAction {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: string[]) => void;
  setSearch: (search: string) => void;
  reset: () => void;
}

const initState: ChatMessageListState = {
  page: 0,
  size: 10,
  sort: ["id,desc"],
  search: "",
};

export const useChatMessageListStore = create(
  devtools(
    combine(
      initState,
      (set): ChatMessageListAction => ({
        setPage: (page) => set({ page }),
        setSize: (size) => set({ size }),
        setSort: (sort) => set({ sort, page: 0 }),
        setSearch: (search) => set({ search }),
        reset: () => set(initState),
      }),
    ),
  ),
);
