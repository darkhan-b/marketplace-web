import { api } from './api';
import type { User } from '../types/user';

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
  const { data } = await api.post<User>('/auth/register', body);

  return data;
};

export const login = async (body: LoginBody) => {
  const { data } = await api.post<User>('/auth/login', body);

  return data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');

  return data;
};