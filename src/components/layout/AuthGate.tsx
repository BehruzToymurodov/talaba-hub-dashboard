import type { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import type { Role } from "@/types";
import { useAuth } from "@/lib/auth/AuthProvider";

export const RequireAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export const RequireRole: FC<{ children: ReactNode; allowed: Role[] }> = ({ children, allowed }) => {
  const { role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Checking access...</div>;
  }

  if (!role || !allowed.includes(role)) {
    return <Navigate to="/403" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
