import { api } from './api';
import type { CreateProductBody, Product } from '../types/product';

interface ProductQuery {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export const getProducts = async (params?: ProductQuery) => {
  const { data } = await api.get<Product[]>('/products', { params });

  return data;
};

export const getProduct = async (id: number) => {
  const { data } = await api.get<Product>(`/products/${id}`);

  return data;
};

export const createProduct = async (body: CreateProductBody) => {
  const { data } = await api.post<Product>('/products', body);

  return data;
};

export const deleteProduct = async (id: number) => {
  const { data } = await api.delete(`/products/${id}`);

  return data;
};