'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, Spin, Typography } from 'antd';

import { getCategories } from '@/shared/api/categories';
import { getProducts } from '@/shared/api/products';
import { ProductCard } from '@/shared/components/ProductCard';
import type { Category } from '@/shared/types/category';
import type { Product } from '@/shared/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async (filters?: {
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setLoading(true);

    try {
      const data = await getProducts(filters);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={2}>Товары</Typography.Title>
        <Typography.Text type="secondary">
          Список товаров мини-маркетплейса
        </Typography.Text>
      </div>

      <Card>
        <Form
          layout="vertical"
          onFinish={loadProducts}
          className="grid grid-cols-1 gap-4 md:grid-cols-5"
        >
          <Form.Item label="Поиск" name="search">
            <Input placeholder="Например: iPhone" />
          </Form.Item>

          <Form.Item label="Категория" name="categoryId">
            <Select
              allowClear
              placeholder="Все категории"
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Цена от" name="minPrice">
            <InputNumber className="!w-full" min={0} />
          </Form.Item>

          <Form.Item label="Цена до" name="maxPrice">
            <InputNumber className="!w-full" min={0} />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit" block>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}