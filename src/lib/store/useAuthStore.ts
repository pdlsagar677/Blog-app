import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserData {
  id: string;
  username: string;
  email: string;
  contact: string;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserData | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      // Only use localStorage in the browser
      getStorage: () => (typeof window !== "undefined" ? localStorage : undefined),
    }
  )
);
