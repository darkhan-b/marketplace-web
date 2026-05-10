import { api } from './api';
import type { Category } from '../types/category';

export const getCategories = async () => {
  const { data } = await api.get<Category[]>('/categories');

  return data;
};

export const createCategory = async (body: { name: string }) => {
  const { data } = await api.post<Category>('/categories', body);

  return data;
};

export const deleteCategory = async (id: number) => {
  const { data } = await api.delete(`/categories/${id}`);

  return data;
};