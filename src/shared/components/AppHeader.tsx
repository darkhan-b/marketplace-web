"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

import { useAuth } from "../providers/AuthProvider";

const navItems = [
  { href: "/products", label: "Товары", icon: <HomeOutlined /> },
  { href: "/cart", label: "Корзина", icon: <ShoppingCartOutlined /> },
  { href: "/favorites", label: "Избранное", icon: <HeartOutlined /> },
  { href: "/profile", label: "Профиль", icon: <UserOutlined /> },
];

export const AppHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuth, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/products" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            DM
          </div>

          <div className="leading-tight">
            <div className="text-xl font-bold text-slate-900">
              Darkhan Marketplace
            </div>
            <div className="text-xs text-slate-500">
              Покупай и продавай проще
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl bg-slate-100 p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900",
                ].join(" ")}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isAuth ? (
            <>
              <span className="hidden text-sm text-slate-500 md:inline">
                {user?.name || user?.email}
              </span>

              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                className="!h-10 !rounded-xl"
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button icon={<LoginOutlined />} className="!h-10 !rounded-xl">
                  Войти
                </Button>
              </Link>

              <Link href="/register">
                <Button type="primary" className="!h-10 !rounded-xl">
                  Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
