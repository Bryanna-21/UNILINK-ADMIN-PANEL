import { create } from "zustand";

interface ModalStore {
  open: boolean;

  content: React.ReactNode | null;

  openModal: (
    content: React.ReactNode
  ) => void;

  closeModal: () => void;
}

export const useModalStore =
  create<ModalStore>((set) => ({
    open: false,

    content: null,

    openModal: (content) =>
      set({
        open: true,
        content,
      }),

    closeModal: () =>
      set({
        open: false,
        content: null,
      }),
  }));
