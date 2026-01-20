import { useEffect } from "react";
import { useAuthStore, UserData } from "../lib/store/useAuthStore";

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  error?: string;
}

export const useAuth = () => {
  const { user, loading, error, setUser, setLoading, setError } = useAuthStore();

  // Load user from session on mount
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) fetchUser(token);
  }, []);

  const fetchUser = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: AuthResponse = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem("sessionToken");
        setUser(null);
      }
    } catch {
      setLoading(false);
      localStorage.removeItem("sessionToken");
      setUser(null);
    }
  };

  // Signup
  const signup = async (userData: {
    username: string;
    email: string;
    password: string;
    contact: string;
  }): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data: AuthResponse = await res.json();
      setLoading(false);

      if (data.success && data.token) {
        localStorage.setItem("sessionToken", data.token);
        fetchUser(data.token);
      } else if (!data.success) {
        setError(data.error || "Signup failed");
      }

      return data;
    } catch {
      setLoading(false);
      setError("Network error");
      return { success: false, error: "Network error" };
    }
  };

  // Login
  const login = async (credentials: { emailOrUsername: string; password: string }): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data: AuthResponse = await res.json();
      setLoading(false);

      if (data.success && data.token) {
        localStorage.setItem("sessionToken", data.token);
        fetchUser(data.token);
      } else if (!data.success) {
        setError(data.error || "Login failed");
      }

      return data;
    } catch {
      setLoading(false);
      setError("Network error");
      return { success: false, error: "Network error" };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("sessionToken");
    setUser(null);
  };

  return { user, loading, error, signup, login, logout };
};
