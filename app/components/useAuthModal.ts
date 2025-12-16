"use client";

import { create } from "zustand";

type AuthMode = "login" | "signup";

interface AuthModalState {
  isOpen: boolean;
  mode: AuthMode;
  open: (mode: AuthMode) => void;
  close: () => void;
}

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  mode: "login",
  open: (mode) => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
}));
