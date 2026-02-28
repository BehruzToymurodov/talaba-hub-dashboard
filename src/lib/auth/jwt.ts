import type { Role } from "@/types";

export type JwtPayload = {
  sub?: string;
  email?: string;
  role?: Role;
  exp?: number;
  iat?: number;
  companyId?: string;
  brandId?: string;
  isStudentStatusVerified?: boolean;
  name?: string;
};

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload?: JwtPayload | null) {
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}
