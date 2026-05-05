'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, Spin, Tag, Typography, message } from 'antd';

import { getProduct } from '@/shared/api/products';
import { addToCart } from '@/shared/api/cart';
import { addToFavorites } from '@/shared/api/favorites';
import type { Product } from '@/shared/types/product';

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      const data = await getProduct(id);
      setProduct(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(id, 1);
      message.success('Добавлено в корзину');
    } catch {
      message.error('Ошибка добавления');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await addToFavorites(id);
      message.success('Добавлено в избранное');
    } catch {
      message.error('Ошибка добавления');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center bg-gray-100">
                Нет изображения
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Typography.Title>{product.title}</Typography.Title>

            {product.category && <Tag>{product.category.name}</Tag>}

            <Typography.Text className="text-xl font-bold">
              {Number(product.price).toLocaleString()} ₸
            </Typography.Text>

            <Typography.Paragraph>
              {product.description || 'Нет описания'}
            </Typography.Paragraph>

            <div className="flex gap-3">
              <Button type="primary" onClick={handleAddToCart}>
                В корзину
              </Button>

              <Button onClick={handleAddToFavorites}>
                В избранное
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}