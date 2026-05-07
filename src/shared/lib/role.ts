import type { UserRole } from '../types/user';

export const roleLabels: Record<UserRole, string> = {
  USER: 'Пользователь',
  SELLER: 'Продавец',
  ADMIN: 'Администратор',
};

export const getRoleLabel = (role?: UserRole) => {
  if (!role) return 'Неизвестно';

  return roleLabels[role] || role;
};

export const getRoleColor = (role?: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return 'red';
    case 'SELLER':
      return 'blue';
    case 'USER':
      return 'green';
    default:
      return 'default';
  }
};