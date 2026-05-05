import { api } from './api';
import type { User, UserRole } from '../types/user';

export const getMe = async () => {
  const { data } = await api.get<User>('/users/me');

  return data;
};

export const updateMe = async (body: { name?: string }) => {
  const { data } = await api.patch<User>('/users/me', body);

  return data;
};

export const getUsers = async () => {
  const { data } = await api.get<User[]>('/users');

  return data;
};

export const updateUserRole = async (id: number, role: UserRole) => {
  const { data } = await api.patch<User>(`/users/${id}/role`, {
    role,
  });

  return data;
};