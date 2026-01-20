import { useEffect, useState } from "react";
import { useAuthStore, UserData } from "../lib/store/useAuthStore";

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  error?: string;
}

export const useAuth = () => {
  const { user, token, loading, error, setUser, setToken, setLoading, setError, logout: storeLogout } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  // Fetch user from token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // If we have a token but no user, fetch the user
      if (token && !user) {
        await fetchUser(token);
      }
      setInitializing(false);
    };

    initializeAuth();
  }, []);

  // Fetch user info by token
  const fetchUser = async (authToken: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data: AuthResponse = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        storeLogout();
      }
    } catch {
      setLoading(false);
      storeLogout();
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
        setToken(data.token);
        await fetchUser(data.token);
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
        setToken(data.token);
        await fetchUser(data.token);
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
    storeLogout();
  };

  return { 
    user, 
    loading: loading || initializing, 
    error, 
    signup, 
    login, 
    logout 
  };
};