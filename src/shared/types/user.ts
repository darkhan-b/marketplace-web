import type { Product } from './product';

export type UserRole = 'USER' | 'SELLER' | 'ADMIN';

export interface UserCartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface UserFavorite {
  id: number;
  createdAt: string;
  product: Product;
}

export interface User {
  id: number;
  email?: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  products?: Product[];
  cartItems?: UserCartItem[];
  favorites?: UserFavorite[];
}