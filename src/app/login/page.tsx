'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, message, Typography } from 'antd';

import { useAuth } from '@/shared/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values);
      message.success('Вход выполнен');
      router.push('/profile');
    } catch {
      message.error('Неверный email или пароль');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md shadow-sm">
        <Typography.Title level={3}>Вход</Typography.Title>

        <Form layout="vertical" onFinish={onFinish}>
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
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form>
      </Card>
    </div>
  );
}