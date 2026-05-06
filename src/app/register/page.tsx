'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, message, Typography } from 'antd';

import { register } from '@/shared/api/auth';
import { setAccessToken } from '@/shared/lib/token';

export default function RegisterPage() {
  const router = useRouter();

  const onFinish = async (values: {
    email: string;
    password: string;
    name?: string;
  }) => {
    try {
      const data = await register(values);

      setAccessToken(data.accessToken);
      message.success('Регистрация успешна');

      router.push('/profile');
    } catch {
      message.error('Не удалось зарегистрироваться');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
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