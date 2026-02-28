import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { loginRequest, logoutRequest } from "@/lib/api/auth";
import { decodeJwt } from "@/lib/auth/jwt";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth/tokenStore";
import { getStoredUser, setStoredUser } from "@/lib/auth/userStore";
import type { AuthUser, Role } from "@/types";

type AuthContextValue = {
  user: AuthUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function buildUserFromToken(token: string): AuthUser | null {
  const payload = decodeJwt(token);
  if (!payload?.sub || !payload?.email || !payload?.role) return null;
  return {
    id: payload.sub,
    email: payload.email,
    role: mapRole(payload.role),
    fullName: payload.name ?? null,
    brandId: (payload as { brandId?: string; companyId?: string }).brandId ?? payload.companyId,
    isStudentStatusVerified: payload.isStudentStatusVerified
  };
}

function mapRole(role: string): Role {
  if (role.toUpperCase() === "ADMIN") return "admin";
  if (role.toUpperCase() === "MODERATOR") return "moderator";
  return "student";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        const tokenUser = buildUserFromToken(accessToken);
        if (tokenUser) {
          setUser(tokenUser);
          setStoredUser(tokenUser);
          setIsLoading(false);
          return;
        }
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsLoading(false);
          return;
        }
      } else {
        setStoredUser(null);
      }
    } catch {
      clearAccessToken();
      setUser(null);
      setStoredUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest({ email, password });
    setAccessToken(data.token);
    const tokenUser = buildUserFromToken(data.token);
    const mappedUser: AuthUser | null = data.user
      ? {
          id: data.user.id,
          email: data.user.email,
          role: mapRole(data.user.role),
          fullName: `${data.user.firstName} ${data.user.lastName}`,
          isStudentStatusVerified: data.user.studentStatusVerified
        }
      : tokenUser;
    setUser(mappedUser);
    setStoredUser(mappedUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    clearAccessToken();
    setUser(null);
    setStoredUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      setUser
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
