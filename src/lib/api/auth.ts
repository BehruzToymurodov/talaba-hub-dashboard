import { baseClient } from "@/lib/api/axios";
import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiRole } from "@/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type MessageResponse = {
  message?: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: ApiRole;
    studentStatusVerified?: boolean;
    createdDate?: string;
  };
};

function unwrap<T>(response: { data: T }) {
  return response.data;
}

export async function loginRequest(payload: LoginPayload) {
  const response = await baseClient.post<LoginResponse>(ENDPOINTS.auth.login, payload);
  return unwrap(response);
}

export async function registerRequest(payload: RegisterPayload) {
  const response = await baseClient.post<MessageResponse>(ENDPOINTS.auth.register, payload);
  return unwrap(response);
}

export async function verifyEmailRequest(token: string) {
  const response = await baseClient.get<MessageResponse>(ENDPOINTS.auth.verifyEmail, {
    params: { token }
  });
  return unwrap(response);
}

export async function getMeRequest() {
  const response = await apiClient.get<LoginResponse["user"]>(ENDPOINTS.account.me);
  return unwrap(response);
}

export async function logoutRequest() {
  return Promise.resolve();
}
