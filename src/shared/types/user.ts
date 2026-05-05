export type UserRole = 'USER' | 'SELLER' | 'ADMIN';

export interface User {
  id: number;
  email?: string;
  name?: string;
  role: UserRole;
  createdAt: string;
}