import type { AuthUser } from "@/types";

const STORAGE_KEY = "talabahub_user";

export function setStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    // TODO: Consider clearing this on logout or when refresh tokens are added.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
