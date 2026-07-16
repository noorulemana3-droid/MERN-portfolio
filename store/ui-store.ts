import { create } from "zustand";

type UiStore = {
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  assistantOpen: false,
  setAssistantOpen: (open) => set({ assistantOpen: open }),
}));
