import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import api from "@/api/axios";
import axios from "axios";

interface AuthContextType {
  role: number | null;
  setRole: (role: number | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Prevent a stale /auth/me failure (sent before login) from overwriting role set by login
  const roleSetByLoginRef = useRef(false);

  const setRole = useCallback((r: number | null) => {
    if (r !== null) {
      roleSetByLoginRef.current = true;
      setIsLoading(false); // so ProtectedRoute sees auth ready right after login
    }
    setRoleState(r);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let retryTimeout: ReturnType<typeof setTimeout>;

    const checkAuth = async (isRetry = false) => {
      try {
        const res = await api.get("/auth/me", { signal: controller.signal });
        roleSetByLoginRef.current = false;
        setRoleState(res.data?.role ?? null);
        setIsLoading(false);
      } catch (err: unknown) {
        if (
          axios.isCancel(err) ||
          (err as { name?: string }).name === "CanceledError" ||
          (err as { code?: string }).code === "ERR_CANCELED" ||
          (err as { code?: string }).code === "ECONNABORTED"
        ) {
          return;
        }
        // Retry once after a short delay (avoids 404 blink on refresh when first request fails e.g. cookie timing)
        if (!isRetry && !roleSetByLoginRef.current) {
          retryTimeout = setTimeout(() => checkAuth(true), 300);
          return; // keep isLoading true so user sees Loading until retry finishes
        }
        if (!roleSetByLoginRef.current) {
          setRoleState(null);
        }
        console.error("❌ Unauthorized:", err);
        setIsLoading(false);
      }
    };

    checkAuth();
    return () => {
      controller.abort();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      roleSetByLoginRef.current = false;
      setRoleState(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, []);

  const value: AuthContextType = {
    role,
    setRole,
    isLoading,
    isAuthenticated: role !== null,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
