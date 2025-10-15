import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

import { OfferStatus } from "../types/offer.types";

interface MyOfferListState {
  page: number;
  size: number;
  sort: string[];
  status: OfferStatus;
}

interface MyOfferListAction {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: string[]) => void;
  setStatus: (status: OfferStatus) => void;
  reset: () => void;
}

const initState: MyOfferListState = {
  page: 0,
  size: 20,
  sort: ["id,desc"],
  status: undefined,
};

export const useMyOfferListStore = create(
  devtools(
    combine(
      initState,
      (set): MyOfferListAction => ({
        setPage: (page) => set({ page }),
        setSize: (size) => set({ size }),
        setSort: (sort) => set({ sort, page: 0 }),
        setStatus: (status) => set({ status }),
        reset: () => set(initState),
      }),
    ),
  ),
);
