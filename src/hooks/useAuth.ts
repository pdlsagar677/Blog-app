// hooks/useAuth.ts
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
      console.log("Initializing auth...");
      console.log("Zustand token:", token);
      console.log("LocalStorage token:", localStorage.getItem("sessionToken"));
      
      // If we have a token in Zustand but no user, fetch the user
      if (token && !user) {
        console.log("Token exists but no user, fetching user...");
        await fetchUser(token);
      } 
      // If no token in Zustand but we have one in localStorage (from another browser)
      else if (!token) {
        const storedToken = localStorage.getItem("sessionToken");
        if (storedToken) {
          console.log("Found token in localStorage, setting in Zustand...");
          setToken(storedToken);
          await fetchUser(storedToken);
        }
      }
      
      setInitializing(false);
    };

    initializeAuth();
  }, []);

  // Fetch user info by token
  const fetchUser = async (authToken: string) => {
    try {
      setLoading(true);
      console.log("Fetching user with token:", authToken);
      
      const res = await fetch("/api/auth/me", {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      const data: AuthResponse = await res.json();
      console.log("User fetch response:", data);
      
      setLoading(false);

      if (data.success && data.user) {
        setUser(data.user);
        // Make sure token is also stored in localStorage for API calls
        localStorage.setItem("sessionToken", authToken);
      } else {
        console.log("User fetch failed, logging out");
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
      logout();
    }
  };

  // Helper to sync token to localStorage
  const syncTokenToStorage = (token: string) => {
    // Store in Zustand
    setToken(token);
    // Store in localStorage for API calls
    localStorage.setItem("sessionToken", token);
    console.log("Token synced to localStorage:", token);
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
        // Sync token to both Zustand and localStorage
        syncTokenToStorage(data.token);
        await fetchUser(data.token);
      } else if (!data.success) {
        setError(data.error || "Signup failed");
      }

      return data;
    } catch (error) {
      console.error("Signup error:", error);
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
        // Sync token to both Zustand and localStorage
        syncTokenToStorage(data.token);
        await fetchUser(data.token);
      } else if (!data.success) {
        setError(data.error || "Login failed");
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      setError("Network error");
      return { success: false, error: "Network error" };
    }
  };

  // Logout
  const logout = () => {
    console.log("Logging out...");
    // Clear everything
    localStorage.removeItem("sessionToken");
    storeLogout();
  };

  return { 
    user, 
    token, // Export token so components can use it
    loading: loading || initializing, 
    error, 
    signup, 
    login, 
    logout 
  };
};