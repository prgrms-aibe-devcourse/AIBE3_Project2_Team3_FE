import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

import { ApplicationStatus } from "../types/application.types";
import { OfferStatus } from "../types/offer.types";

interface ReceivedOfferListState {
  page: number;
  size: number;
  sort: string[];
  status: OfferStatus;
}

interface ReceivedOfferListAction {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSort: (sort: string[]) => void;
  setStatus: (status: ApplicationStatus) => void;
  reset: () => void;
}

const initState: ReceivedOfferListState = {
  page: 0,
  size: 10,
  sort: ["id,desc"],
  status: undefined,
};

export const useReceivedOfferListStore = create(
  devtools(
    combine(
      initState,
      (set): ReceivedOfferListAction => ({
        setPage: (page) => set({ page }),
        setSize: (size) => set({ size }),
        setSort: (sort) => set({ sort, page: 0 }),
        setStatus: (status) => set({ status }),
        reset: () => set(initState),
      }),
    ),
  ),
);
