'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Descriptions, Form, Input, message, Spin, Typography } from 'antd';

import { getMe, updateMe } from '@/shared/api/users';
import { removeAccessToken } from '@/shared/lib/token';
import type { User } from '@/shared/types/user';

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <Typography.Title level={3}>Мой профиль</Typography.Title>

        <Descriptions column={1} bordered>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Имя">{user.name || 'Не указано'}</Descriptions.Item>
          <Descriptions.Item label="Роль">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Дата регистрации">
            {new Date(user.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Typography.Title level={4}>Обновить профиль</Typography.Title>

        <Form
          layout="vertical"
          initialValues={{
            name: user.name,
          }}
          onFinish={onFinish}
        >
          <Form.Item label="Имя" name="name">
            <Input placeholder="Введите имя" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form>
      </Card>
    </div>
  );
}