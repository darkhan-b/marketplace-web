'use client';

import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Spin,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import {
  EditOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { getMe, updateMe } from '@/shared/api/users';
import type { User } from '@/shared/types/user';

const demoUser: User = {
  id: 0,
  email: 'demo@mail.com',
  name: 'Demo User',
  role: 'USER',
  createdAt: new Date().toISOString(),
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(demoUser);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await getMe();

      setUser(data);
      setIsDemoMode(false);
    } catch {
      setUser(demoUser);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onFinish = async (values: { name?: string }) => {
    if (isDemoMode) {
      setUser((prev) => ({
        ...(prev || demoUser),
        name: values.name || demoUser.name,
      }));

      message.info('Демо-режим: изменения сохранены только на экране');
      return;
    }

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
                <div className="mb-2 flex items-center gap-2">
                  <Typography.Title level={2} className="!m-0">
                    {user.name || 'Без имени'}
                  </Typography.Title>

                  <Tag color={user.role === 'ADMIN' ? 'red' : user.role === 'SELLER' ? 'blue' : 'green'}>
                    {user.role}
                  </Tag>

                  {isDemoMode && <Tag color="orange">DEMO</Tag>}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <Statistic
            title="Мои товары"
            value={0}
            prefix={<ShoppingCartOutlined />}
          />
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <Statistic title="В корзине" value={0} prefix={<ShoppingCartOutlined />} />
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <Statistic title="Избранное" value={0} prefix={<StarOutlined />} />
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
    </div>
  );
}