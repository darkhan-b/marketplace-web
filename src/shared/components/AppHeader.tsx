'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

import { getAccessToken, removeAccessToken } from '../lib/token';

export const AppHeader = () => {
  const router = useRouter();
  const token = getAccessToken();

  const handleLogout = () => {
    removeAccessToken();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-black">
          Mini Marketplace
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/products">Товары</Link>
          <Link href="/cart">Корзина</Link>
          <Link href="/favorites">Избранное</Link>
          <Link href="/profile">Профиль</Link>

          {token ? (
            <Button onClick={handleLogout}>Выйти</Button>
          ) : (
            <>
              <Link href="/login">
                <Button>Войти</Button>
              </Link>
              <Link href="/register">
                <Button type="primary">Регистрация</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};