'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'antd';
import {
  EditOutlined,
  HeartOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { getMe, updateMe } from '@/shared/api/users';
import { removeAccessToken } from '@/shared/lib/token';
import type { User } from '@/shared/types/user';

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const products = user?.products || [];
  const cartItems = user?.cartItems || [];
  const favorites = user?.favorites || [];

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);
  }, [cartItems]);

  const loadProfile = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch {
      removeAccessToken();
      router.push('/login');
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
      message.success('Профиль обновлён');
    } catch {
      message.error('Не удалось обновить профиль');
    }
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
                    {user.name || 'Без имени'}
                  </Typography.Title>

                  <Tag
                    color={
                      user.role === 'ADMIN'
                        ? 'red'
                        : user.role === 'SELLER'
                          ? 'blue'
                          : 'green'
                    }
                  >
                    {user.role}
                  </Tag>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <MailOutlined />
                  <span>{user.email || 'email не указан'}</span>
                </div>
              </div>
            </div>

            <Button type="primary" icon={<EditOutlined />} size="large">
              Редактировать профиль
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="rounded-2xl shadow-sm">
          <Statistic
            title="Мои товары"
            value={products.length}
            prefix={<ShoppingCartOutlined />}
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
            title="Сумма корзины"
            value={cartTotal}
            suffix="₸"
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <Typography.Title level={4}>Информация</Typography.Title>

          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Имя">
              {user.name || 'Не указано'}
            </Descriptions.Item>
            <Descriptions.Item label="Роль">{user.role}</Descriptions.Item>
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
        </Card>
      </div>

      <Card className="rounded-3xl shadow-sm">
        <Tabs
          items={[
            {
              key: 'cart',
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
                              src={item.product.imageUrl || ''}
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
              key: 'favorites',
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
                              src={item.product.imageUrl || ''}
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
              key: 'products',
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
                              src={product.imageUrl || ''}
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