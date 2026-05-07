'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Empty,
  Image,
  List,
  message,
  Popconfirm,
  Spin,
  Tag,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  HeartFilled,
  ShoppingCartOutlined,
} from '@ant-design/icons';

import { addToCart } from '@/shared/api/cart';
import {
  getFavorites,
  removeFromFavorites,
} from '@/shared/api/favorites';
import { removeAccessToken } from '@/shared/lib/token';
import type { Product } from '@/shared/types/product';

interface FavoriteItem {
  id: number;
  product: Product;
}

export default function FavoritesPage() {
  const router = useRouter();

  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch {
      removeAccessToken();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await removeFromFavorites(productId);

      setItems((prev) =>
        prev.filter(
          (item) => item.product.id !== productId,
        ),
      );

      message.success('Удалено из избранного');
    } catch {
      message.error('Не удалось удалить из избранного');
    }
  };

  const handleAddToCart = async (
    productId: number,
  ) => {
    try {
      await addToCart(productId, 1);

      message.success('Добавлено в корзину');
    } catch {
      message.error('Не удалось добавить в корзину');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 p-1 shadow-sm">
        <div className="rounded-[22px] bg-white/95 p-6 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography.Title level={2} className="!mb-1">
                Избранное
              </Typography.Title>

              <Typography.Text type="secondary">
                Товары, которые вы сохранили
              </Typography.Text>
            </div>

            <div className="flex items-center gap-2">
              <HeartFilled className="text-2xl text-rose-500" />

              <Typography.Text strong>
                {items.length} товаров
              </Typography.Text>
            </div>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <Card className="rounded-3xl shadow-sm">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Избранных товаров пока нет"
          >
            <Link href="/products">
              <Button type="primary">
                Смотреть товары
              </Button>
            </Link>
          </Empty>
        </Card>
      ) : (
        <Card className="rounded-3xl shadow-sm">
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="cart"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() =>
                      handleAddToCart(
                        item.product.id,
                      )
                    }
                  >
                    В корзину
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="Удалить из избранного?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={() =>
                      handleRemove(item.product.id)
                    }
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Image
                      src={item.product.imageUrl || ''}
                      alt={item.product.title}
                      width={112}
                      height={112}
                      className="rounded-2xl object-cover"
                      fallback="https://placehold.co/200x200?text=No+Image"
                    />
                  }
                  title={
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/products/${item.product.id}`}
                      >
                        {item.product.title}
                      </Link>

                      {item.product.category && (
                        <Tag>
                          {item.product.category.name}
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <div>
                        {item.product.description ||
                          'Нет описания'}
                      </div>

                      <Typography.Text
                        strong
                        className="text-lg"
                      >
                        {Number(
                          item.product.price,
                        ).toLocaleString()}{' '}
                        ₸
                      </Typography.Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
}