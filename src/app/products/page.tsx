'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Tag,
  Typography,
} from 'antd';
import {
  FireOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

import { getCategories } from '@/shared/api/categories';
import { getProducts } from '@/shared/api/products';
import { ProductCard } from '@/shared/components/ProductCard';
import type { Category } from '@/shared/types/category';
import type { Product } from '@/shared/types/product';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro',
    description: '256GB, отличное состояние',
    price: 620000,
    imageUrl:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    category: {
      id: 1,
      name: 'Электроника',
    },
  },
  {
    id: 2,
    title: 'MacBook Air M2',
    description: 'Ноутбук Apple',
    price: 780000,
    imageUrl:
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    category: {
      id: 1,
      name: 'Электроника',
    },
  },
  {
    id: 3,
    title: 'PlayStation 5',
    description: 'Новая ревизия',
    price: 320000,
    imageUrl:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1200&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    category: {
      id: 2,
      name: 'Игры',
    },
  },
];

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Электроника',
  },
  {
    id: 2,
    name: 'Игры',
  },
  {
    id: 3,
    name: 'Одежда',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const loadProducts = async (filters?: {
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setLoading(true);

    try {
      const data = await getProducts(filters);

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(mockProducts);
        setDemoMode(true);
      }
    } catch {
      setProducts(mockProducts);
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories(mockCategories);
      }
    } catch {
      setCategories(mockCategories);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-1 shadow-sm">
        <div className="rounded-[22px] bg-white/95 p-8 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <Typography.Title level={1} className="!m-0">
                  Marketplace
                </Typography.Title>

                {demoMode && (
                  <Badge
                    count="NEW"
                    style={{
                      backgroundColor: '#fa8c16',
                    }}
                  />
                )}
              </div>

              <Typography.Text className="text-base text-slate-500">
                Покупай и продавай товары быстро и удобно
              </Typography.Text>
            </div>

            <div className="flex items-center gap-3">
              <Tag
                color="blue"
                className="!rounded-xl !px-4 !py-2 !text-sm"
              >
                <FireOutlined /> Популярное
              </Tag>

              <Tag
                color="purple"
                className="!rounded-xl !px-4 !py-2 !text-sm"
              >
                <ShoppingOutlined /> Новые товары
              </Tag>
            </div>
          </div>
        </div>
      </section>

      <Card className="rounded-3xl shadow-sm">
        <Form
          layout="vertical"
          onFinish={loadProducts}
          className="grid grid-cols-1 gap-4 md:grid-cols-5"
        >
          <Form.Item label="Поиск" name="search">
            <Input
              size="large"
              prefix={<SearchOutlined />}
              placeholder="Например: iPhone"
            />
          </Form.Item>

          <Form.Item label="Категория" name="categoryId">
            <Select
              size="large"
              allowClear
              placeholder="Все категории"
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Цена от" name="minPrice">
            <InputNumber
              size="large"
              className="!w-full"
              min={0}
            />
          </Form.Item>

          <Form.Item label="Цена до" name="maxPrice">
            <InputNumber
              size="large"
              className="!w-full"
              min={0}
            />
          </Form.Item>

          <Form.Item label=" ">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              Фильтровать
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Typography.Title level={3} className="!m-0">
              Товары
            </Typography.Title>

            <Typography.Text className="text-slate-500">
              Найдено: {products.length}
            </Typography.Text>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}