import { api } from './api';
import type { User } from '../types/user';

export interface AuthResponse {
  user: User;
  accessToken: string;
}

interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const register = async (
  body: RegisterBody,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>(
    '/auth/register',
    body,
  );

  return data;
};

export const login = async (
  body: LoginBody,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>(
    '/auth/login',
    body,
  );

  return data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');

  return data;
};