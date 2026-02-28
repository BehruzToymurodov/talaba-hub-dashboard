import { LOCAL_ACCESS_KEY } from "@/lib/auth/constants";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      // TODO: Prefer httpOnly refresh cookies. This localStorage is a fallback if refresh is unavailable.
      localStorage.setItem(LOCAL_ACCESS_KEY, token);
    } else {
      localStorage.removeItem(LOCAL_ACCESS_KEY);
    }
  }
}

export function getAccessToken() {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    // TODO: Avoid persisting access tokens unless refresh tokens are not available.
    accessToken = localStorage.getItem(LOCAL_ACCESS_KEY);
  }
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_ACCESS_KEY);
  }
}
