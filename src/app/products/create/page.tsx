'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Spin,
  Typography,
} from 'antd';

import { getCategories } from '@/shared/api/categories';
import { createProduct } from '@/shared/api/products';
import { useAuth } from '@/shared/providers/AuthProvider';
import type { Category } from '@/shared/types/category';

export default function CreateProductPage() {
  const router = useRouter();
  const { user, isAuth, loading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAuth) {
      router.replace('/login');
      return;
    }

    if (!loading && isAuth && user?.role === 'USER') {
      message.error('У вас нет доступа к созданию товаров');
      router.replace('/products');
    }
  }, [loading, isAuth, user?.role, router]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        message.error('Не удалось загрузить категории');
      }
    };

    loadCategories();
  }, []);

  const onFinish = async (values: {
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
  }) => {
    try {
      setSaving(true);

      const product = await createProduct(values);

      message.success('Товар создан');
      router.push(`/products/${product.id}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;

      message.error(
        Array.isArray(errorMessage)
          ? errorMessage[0]
          : errorMessage || 'Не удалось создать товар',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || !isAuth || user?.role === 'USER') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="rounded-3xl shadow-sm">
        <Typography.Title level={2} className="!mb-1">
          Добавить товар
        </Typography.Title>

        <Typography.Text type="secondary">
          Заполните данные товара, который хотите разместить на маркетплейсе.
        </Typography.Text>
      </Card>

      <Card className="rounded-3xl shadow-sm">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: 'Введите название товара' }]}
          >
            <Input size="large" placeholder="Например: PlayStation 5" />
          </Form.Item>

          <Form.Item label="Описание" name="description">
            <Input.TextArea
              rows={4}
              placeholder="Кратко опишите состояние, характеристики и комплект"
            />
          </Form.Item>

          <Form.Item
            label="Цена"
            name="price"
            rules={[{ required: true, message: 'Введите цену' }]}
          >
            <InputNumber
              size="large"
              min={1}
              className="!w-full"
              placeholder="Например: 320000"
            />
          </Form.Item>

          <Form.Item label="Ссылка на изображение" name="imageUrl">
            <Input
              size="large"
              placeholder="https://example.com/product.jpg"
            />
          </Form.Item>

          <Form.Item label="Категория" name="categoryId">
            <Select
              size="large"
              allowClear
              placeholder="Выберите категорию"
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={saving}
          >
            Создать товар
          </Button>
        </Form>
      </Card>
    </div>
  );
}