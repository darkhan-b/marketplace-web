'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, message, Spin, Typography } from 'antd';

import { useAuth } from '@/shared/providers/AuthProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuth, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuth) {
      router.replace('/profile');
    }
  }, [isAuth, loading, router]);

  const onFinish = async (values: {
    email: string;
    password: string;
    name?: string;
  }) => {
    try {
      await register(values);

      message.success('Регистрация успешна');
      router.replace('/profile');
    } catch {
      message.error('Не удалось зарегистрироваться');
    }
  };

  if (loading || isAuth) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md shadow-sm">
        <Typography.Title level={3}>Регистрация</Typography.Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Имя" name="name">
            <Input placeholder="Ваше имя" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Введите email' }]}
          >
            <Input placeholder="user@mail.com" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password placeholder="Минимум 6 символов" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Зарегистрироваться
          </Button>
        </Form>
      </Card>
    </div>
  );
}