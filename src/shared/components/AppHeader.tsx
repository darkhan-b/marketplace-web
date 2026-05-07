"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppstoreOutlined,
  HeartOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  PlusOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Dropdown, Menu, Space } from "antd";
import { useMemo, useState } from "react";

import { useAuth } from "../providers/AuthProvider";
import { getRoleLabel } from "../lib/role";

export const AppHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuth, logout, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = useMemo(() => {
    const items = [
      {
        key: "/products",
        label: "Товары",
        icon: <AppstoreOutlined />,
        href: "/products",
      },
      {
        key: "/orders",
        label: "Заказы",
        icon: <ProfileOutlined />,
        href: "/orders",
        auth: true,
      },
      {
        key: "/cart",
        label: "Корзина",
        icon: <ShoppingCartOutlined />,
        href: "/cart",
        auth: true,
      },
      {
        key: "/favorites",
        label: "Избранное",
        icon: <HeartOutlined />,
        href: "/favorites",
        auth: true,
      },
      {
        key: "/admin/orders",
        label: "Админ: заказы",
        icon: <ShoppingOutlined />,
        href: "/admin/orders",
        auth: true,
        adminOnly: true,
      },
    ];

    return items.filter((item) => {
      if (item.auth && !isAuth) return false;
      if (item.adminOnly && user?.role !== "ADMIN") return false;

      return true;
    });
  }, [isAuth, user?.role]);

  const selectedKey =
    menuItems.find((item) => pathname.startsWith(item.href))?.key ||
    "/products";

  const handleLogout = async () => {
    await logout();
    setDrawerOpen(false);
    router.push("/login");
  };

  const handleMenuClick = (key: string) => {
    router.push(key);
    setDrawerOpen(false);
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "Профиль",
      icon: <UserOutlined />,
      onClick: () => router.push("/profile"),
    },
    {
      key: "orders",
      label: "Мои заказы",
      icon: <ProfileOutlined />,
      onClick: () => router.push("/orders"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Выйти",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/products" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white shadow">
            DM
          </div>

          <div className="hidden leading-tight sm:block">
            <div className="text-base font-black tracking-tight text-slate-900">
              Darkhan Marketplace
            </div>
            <div className="text-xs text-slate-500">
              Покупай и продавай проще
            </div>
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block">
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            className="!border-none"
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
              onClick: () => handleMenuClick(item.href),
            }))}
          />
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {isAuth ? (
            <>
              {(user?.role === "SELLER" || user?.role === "ADMIN") && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => router.push("/products/create")}
                  className="!rounded-xl"
                >
                  Добавить товар
                </Button>
              )}

              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <Button className="!h-10 !rounded-xl">
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span className="max-w-[120px] truncate">
                      {user?.name || user?.email || "Профиль"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {getRoleLabel(user?.role)}
                    </span>
                  </Space>
                </Button>
              </Dropdown>
            </>
          ) : (
            <>
              <Button
                icon={<LoginOutlined />}
                onClick={() => router.push("/login")}
                className="!rounded-xl"
              >
                Войти
              </Button>

              <Button
                type="primary"
                onClick={() => router.push("/register")}
                className="!rounded-xl"
              >
                Регистрация
              </Button>
            </>
          )}
        </div>

        <Button
          icon={<MenuOutlined />}
          onClick={() => setDrawerOpen(true)}
          className="ml-auto !h-10 !w-10 !rounded-xl lg:!hidden"
        />

        <Drawer
          title={
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white">
                DM
              </div>
              <div>
                <div className="font-black">Darkhan Marketplace</div>
                <div className="text-xs font-normal text-slate-500">Меню</div>
              </div>
            </div>
          }
          placement="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={320}
        >
          {isAuth && (
            <div className="mb-5 rounded-2xl bg-slate-100 p-4">
              <div className="flex items-center gap-3">
                <Avatar icon={<UserOutlined />} className="!bg-blue-600" />
                <div>
                  <div className="font-semibold">
                    {user?.name || "Пользователь"}
                  </div>
                  <span className="text-xs text-slate-400">
                    {getRoleLabel(user?.role)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {menuItems.map((item) => {
              const active = selectedKey === item.key;

              return (
                <Button
                  key={item.key}
                  type={active ? "primary" : "default"}
                  icon={item.icon}
                  block
                  className="!flex !h-11 !items-center !justify-start !rounded-xl"
                  onClick={() => handleMenuClick(item.href)}
                >
                  {item.label}
                </Button>
              );
            })}

            {isAuth && (user?.role === "SELLER" || user?.role === "ADMIN") && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                block
                className="!flex !h-11 !items-center !justify-start !rounded-xl"
                onClick={() => handleMenuClick("/products/create")}
              >
                Добавить товар
              </Button>
            )}
          </div>

          <div className="mt-6 border-t pt-4">
            {isAuth ? (
              <Button
                danger
                icon={<LogoutOutlined />}
                block
                className="!h-11 !rounded-xl"
                onClick={handleLogout}
              >
                Выйти
              </Button>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <Button
                  icon={<LoginOutlined />}
                  block
                  className="!h-11 !rounded-xl"
                  onClick={() => handleMenuClick("/login")}
                >
                  Войти
                </Button>

                <Button
                  type="primary"
                  block
                  className="!h-11 !rounded-xl"
                  onClick={() => handleMenuClick("/register")}
                >
                  Регистрация
                </Button>
              </div>
            )}
          </div>
        </Drawer>
      </div>
    </header>
  );
};
