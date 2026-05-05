import type { Category } from './category';
import type { User } from './user';

export interface Product {
  id: number;
  title: string;
  description?: string;
  price: string | number;
  imageUrl?: string;
  createdAt: string;
  user?: User;
  category?: Category | null;
}

export interface CreateProductBody {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
}