import { create } from "zustand";

export interface UserData {
  id: string;
  username: string;
  email: string;
  contact: string;
}

interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
