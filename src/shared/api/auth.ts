import { api } from './api';
import type { User } from '../types/user';

interface AuthResponse {
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

export const register = async (body: RegisterBody) => {
  const { data } = await api.post<AuthResponse>('/auth/register', body);

  return data;
};

export const login = async (body: LoginBody) => {
  const { data } = await api.post<AuthResponse>('/auth/login', body);

  return data;
};