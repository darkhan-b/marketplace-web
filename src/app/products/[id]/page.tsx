'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeftOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Divider, message, Spin, Tag, Typography } from 'antd';
import Link from 'next/link';

import { addToCart } from '@/shared/api/cart';
import { addToFavorites } from '@/shared/api/favorites';
import { getProduct } from '@/shared/api/products';
import type { Product } from '@/shared/types/product';

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const loadProduct = async () => {
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch {
      message.error('Не удалось загрузить товар');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      await addToCart(id, 1);
      message.success('Добавлено в корзину');
    } catch {
      message.error('Войдите в аккаунт, чтобы добавить в корзину');
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      setFavoriteLoading(true);
      await addToFavorites(id);
      message.success('Добавлено в избранное');
    } catch {
      message.error('Войдите в аккаунт, чтобы добавить в избранное');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <Card className="mx-auto max-w-3xl rounded-3xl text-center shadow-sm">
        <Typography.Title level={3}>Товар не найден</Typography.Title>
        <Link href="/products">
          <Button type="primary">Вернуться к товарам</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeftOutlined />
        Назад к товарам
      </Link>

      <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl bg-slate-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-[520px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[520px] items-center justify-center text-slate-400">
                Нет изображения
              </div>
            )}
          </div>

          <div className="flex flex-col py-2">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                {product.category && (
                  <Tag className="!mb-4 !rounded-full !px-4 !py-1">
                    {product.category.name}
                  </Tag>
                )}

                <Typography.Title className="!mb-3 !text-5xl !font-black !leading-tight">
                  {product.title}
                </Typography.Title>

                <Typography.Text className="text-3xl font-bold text-slate-900">
                  {Number(product.price).toLocaleString()} ₸
                </Typography.Text>
              </div>

              <Button
                shape="circle"
                size="large"
                icon={<HeartOutlined />}
                loading={favoriteLoading}
                onClick={handleAddToFavorites}
                className="!h-12 !w-12 !border-slate-200 !text-xl hover:!border-rose-400 hover:!text-rose-500"
              />
            </div>

            <Divider />

            <div className="space-y-3">
              <Typography.Text className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Описание
              </Typography.Text>

              <Typography.Paragraph className="!mb-0 text-lg leading-8 text-slate-700">
                {product.description || 'Продавец не добавил описание к товару.'}
              </Typography.Paragraph>
            </div>

            <Divider />

            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <Avatar icon={<UserOutlined />} className="!bg-blue-600" />

                <div>
                  <div className="font-semibold text-slate-900">
                    {product.user?.name || 'Продавец'}
                  </div>
                  <div className="text-sm text-slate-500">
                    Проверенный пользователь
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <SafetyCertificateOutlined className="text-green-600" />
                Безопасная сделка через Mini Marketplace
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  loading={cartLoading}
                  onClick={handleAddToCart}
                  className="!h-14 !rounded-2xl !text-base !font-semibold"
                >
                  Добавить в корзину
                </Button>

                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  loading={favoriteLoading}
                  onClick={handleAddToFavorites}
                  className="!h-14 !rounded-2xl !text-base !font-semibold hover:!border-rose-400 hover:!text-rose-500"
                >
                  В избранное
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}