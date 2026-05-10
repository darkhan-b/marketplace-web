'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  List,
  message,
  Popconfirm,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import {
  createCategory,
  deleteCategory,
  getCategories,
} from '@/shared/api/categories';
import { useAuth } from '@/shared/providers/AuthProvider';
import type { Category } from '@/shared/types/category';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [form] = Form.useForm<{ name: string }>();

  const { user, isAuth, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      message.error('Не удалось загрузить категории');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isAuth) {
      router.replace('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      message.error('Доступ только для администратора');
      router.replace('/products');
      return;
    }

    loadCategories();
  }, [authLoading, isAuth, user?.role, router]);

  const onFinish = async (values: { name: string }) => {
    try {
      setCreating(true);

      const category = await createCategory({
        name: values.name.trim(),
      });

      setCategories((prev) => [category, ...prev]);
      form.resetFields();

      message.success('Категория создана');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;

      message.error(
        Array.isArray(errorMessage)
          ? errorMessage[0]
          : errorMessage || 'Не удалось создать категорию',
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);

      setCategories((prev) =>
        prev.filter((category) => category.id !== id),
      );

      message.success('Категория удалена');
    } catch {
      message.error('Не удалось удалить категорию');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <Typography.Title level={2} className="!mb-0">
            Управление категориями
          </Typography.Title>

          <Typography.Text type="secondary">
            Создание и удаление категорий доступно только администратору
          </Typography.Text>
        </div>
      </section>

      <Card className="rounded-3xl shadow-sm">
        <Typography.Title level={4}>Добавить категорию</Typography.Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Название категории"
            name="name"
            rules={[
              { required: true, message: 'Введите название категории' },
              { min: 2, message: 'Минимум 2 символа' },
            ]}
          >
            <Input size="large" placeholder="Например: Электроника" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={creating}
          >
            Добавить
          </Button>
        </Form>
      </Card>

      <Card className="rounded-3xl shadow-sm">
        <Typography.Title level={4}>Список категорий</Typography.Title>

        {categories.length === 0 ? (
          <Empty description="Категорий пока нет" />
        ) : (
          <List
            dataSource={categories}
            renderItem={(category) => (
              <List.Item
                actions={[
                  <Popconfirm
                    key="delete"
                    title="Удалить категорию?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={() => handleDelete(category.id)}
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      Удалить
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center gap-2">
                      <Tag color="blue">#{category.id}</Tag>
                      <span>{category.name}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}