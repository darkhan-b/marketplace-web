"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Empty,
  Form,
  Image,
  Input,
  List,
  message,
  Spin,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  EditOutlined,
  HeartOutlined,
  MailOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  StarOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import { getMyOrders } from "@/shared/api/orders";
import { getMe, updateMe } from "@/shared/api/users";
import { removeAccessToken } from "@/shared/lib/token";
import type { Product } from "@/shared/types/product";
import type { User } from "@/shared/types/user";
import { getRoleColor, getRoleLabel } from "@/shared/lib/role";

interface OrderItem {
  id: number;
  quantity: number;
  price: string | number;
  product: Product;
}

interface Order {
  id: number;
  totalPrice: string | number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const products = user?.products || [];
  const cartItems = user?.cartItems || [];
  console.log(cartItems)
  const favorites = user?.favorites || [];

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);
  }, [cartItems]);

  const ordersTotal = useMemo(() => {
    return orders.reduce((sum, order) => {
      return sum + Number(order.totalPrice);
    }, 0);
  }, [orders]);

  const loadProfile = async () => {
    try {
      const [me, myOrders] = await Promise.all([getMe(), getMyOrders()]);

      setUser(me);
      setOrders(Array.isArray(myOrders) ? myOrders : []);
    } catch {
      removeAccessToken();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onFinish = async (values: { name?: string }) => {
    try {
      const updatedUser = await updateMe(values);

      setUser(updatedUser);
      message.success("Профиль обновлён");
    } catch {
      message.error("Не удалось обновить профиль");
    }
  };

  const getOrderStatusColor = (status: Order["status"]) => {
    if (status === "PAID") return "green";
    if (status === "CANCELLED") return "red";

    return "blue";
  };

  const getOrderStatusLabel = (status: Order["status"]) => {
    if (status === "PAID") return "Оплачен";
    if (status === "CANCELLED") return "Отменён";

    return "Ожидает";
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-1 shadow-sm">
        <div className="rounded-[22px] bg-white/95 p-6 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Avatar
                size={88}
                icon={<UserOutlined />}
                className="!bg-blue-600"
              />

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Typography.Title level={2} className="!m-0">
                    {user.name || "Без имени"}
                  </Typography.Title>

                  <Tag color={getRoleColor(user.role)}>
                    {getRoleLabel(user.role)}
                  </Tag>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <MailOutlined />
                  <span>{user.email || "email не указан"}</span>
                </div>
              </div>
            </div>

            <Button type="primary" icon={<EditOutlined />} size="large">
              Редактировать профиль
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card className="rounded-2xl shadow-sm">
          <Statistic
            title="Мои товары"
            value={products.length}
            prefix={<ShoppingOutlined />}
          />
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <Statistic
            title="В корзине"
            value={cartItems.length}
            prefix={<ShoppingCartOutlined />}
          />
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <Statistic
            title="Избранное"
            value={favorites.length}
            prefix={<StarOutlined />}
          />
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <Statistic
            title="Заказы"
            value={orders.length}
            prefix={<ProfileOutlined />}
          />
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <Statistic
            title="Сумма корзины"
            value={cartTotal}
            suffix="₸"
            prefix={<ShoppingCartOutlined />}
          />

          <div className="mt-2 text-xs text-slate-500">
            Товаров: {cartItems.length}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <Typography.Title level={4}>Информация</Typography.Title>

          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Имя">
              {user.name || "Не указано"}
            </Descriptions.Item>
            <Descriptions.Item label="Роль">
              {getRoleLabel(user.role)}
            </Descriptions.Item>
            <Descriptions.Item label="Дата регистрации">
              {new Date(user.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <Typography.Title level={4}>Обновить профиль</Typography.Title>

          <Form
            layout="vertical"
            initialValues={{
              name: user.name,
            }}
            onFinish={onFinish}
          >
            <Form.Item label="Имя" name="name">
              <Input size="large" placeholder="Введите имя" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block>
              Сохранить изменения
            </Button>
          </Form>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <Typography.Text type="secondary">
              Сумма текущей корзины:{" "}
            </Typography.Text>

            <Typography.Text strong>
              {cartTotal.toLocaleString()} ₸
            </Typography.Text>
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl shadow-sm">
        <Tabs
          items={[
            {
              key: "orders",
              label: `Заказы (${orders.length})`,
              children:
                orders.length === 0 ? (
                  <Empty description="Заказов пока нет" />
                ) : (
                  <List
                    itemLayout="vertical"
                    dataSource={orders}
                    renderItem={(order) => (
                      <List.Item>
                        <Card className="rounded-2xl bg-slate-50">
                          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <Typography.Title level={5} className="!mb-1">
                                Заказ #{order.id}
                              </Typography.Title>

                              <Typography.Text type="secondary">
                                {new Date(order.createdAt).toLocaleString()}
                              </Typography.Text>
                            </div>

                            <div className="flex items-center gap-3">
                              <Tag color={getOrderStatusColor(order.status)}>
                                {getOrderStatusLabel(order.status)}
                              </Tag>

                              <Typography.Text strong>
                                {Number(order.totalPrice).toLocaleString()} ₸
                              </Typography.Text>
                            </div>
                          </div>

                          <List
                            size="small"
                            dataSource={order.items || []}
                            renderItem={(item) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={
                                    <Image
                                      src={item.product.imageUrl || ""}
                                      alt={item.product.title}
                                      width={56}
                                      height={56}
                                      className="rounded-xl object-cover"
                                      fallback="https://placehold.co/100x100?text=No+Image"
                                    />
                                  }
                                  title={
                                    <Link href={`/products/${item.product.id}`}>
                                      {item.product.title}
                                    </Link>
                                  }
                                  description={
                                    <span>
                                      {item.quantity} шт. ×{" "}
                                      {Number(item.price).toLocaleString()} ₸
                                    </span>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                ),
            },
            {
              key: "cart",
              label: `Корзина (${cartItems.length})`,
              children:
                cartItems.length === 0 ? (
                  <Empty description="Корзина пустая" />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Image
                              src={item.product.imageUrl || ""}
                              alt={item.product.title}
                              width={72}
                              height={72}
                              className="rounded-xl object-cover"
                              fallback="https://placehold.co/100x100?text=No+Image"
                            />
                          }
                          title={
                            <Link href={`/products/${item.product.id}`}>
                              {item.product.title}
                            </Link>
                          }
                          description={
                            <div>
                              <div>Количество: {item.quantity}</div>
                              <strong>
                                {Number(item.product.price).toLocaleString()} ₸
                              </strong>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ),
            },
            {
              key: "favorites",
              label: `Избранное (${favorites.length})`,
              children:
                favorites.length === 0 ? (
                  <Empty description="Избранных товаров нет" />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={favorites}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Image
                              src={item.product.imageUrl || ""}
                              alt={item.product.title}
                              width={72}
                              height={72}
                              className="rounded-xl object-cover"
                              fallback="https://placehold.co/100x100?text=No+Image"
                            />
                          }
                          title={
                            <div className="flex items-center gap-2">
                              <HeartOutlined className="text-rose-500" />

                              <Link href={`/products/${item.product.id}`}>
                                {item.product.title}
                              </Link>
                            </div>
                          }
                          description={
                            <div>
                              {item.product.category && (
                                <Tag>{item.product.category.name}</Tag>
                              )}

                              <strong>
                                {Number(item.product.price).toLocaleString()} ₸
                              </strong>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ),
            },
            {
              key: "products",
              label: `Мои товары (${products.length})`,
              children:
                products.length === 0 ? (
                  <Empty description="Вы пока не добавили товары" />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={products}
                    renderItem={(product) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Image
                              src={product.imageUrl || ""}
                              alt={product.title}
                              width={72}
                              height={72}
                              className="rounded-xl object-cover"
                              fallback="https://placehold.co/100x100?text=No+Image"
                            />
                          }
                          title={
                            <Link href={`/products/${product.id}`}>
                              {product.title}
                            </Link>
                          }
                          description={
                            <strong>
                              {Number(product.price).toLocaleString()} ₸
                            </strong>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
