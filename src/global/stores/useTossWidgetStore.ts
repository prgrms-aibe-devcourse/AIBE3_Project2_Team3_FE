import { TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

interface TossWidgetState {
  widgets: TossPaymentsWidgets | null;
  ready: boolean;
}

interface TossWidgetAction {
  setWidgets: (widget: TossPaymentsWidgets | null) => void;
  setReady: (ready: boolean) => void;
  reset: () => void;
}

const initState: TossWidgetState = {
  widgets: null,
  ready: false,
};

export const useTossWidgetStore = create(
  devtools(
    combine(
      initState,
      (set): TossWidgetAction => ({
        setWidgets: (widgets) => set({ widgets }),
        setReady: (ready) => set({ ready }),
        reset: () => set(initState),
      }),
    ),
  ),
);
