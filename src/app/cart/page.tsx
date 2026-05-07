'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Empty,
  Image,
  InputNumber,
  List,
  message,
  Popconfirm,
  Spin,
  Statistic,
  Typography,
} from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
} from '@ant-design/icons';

import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '@/shared/api/cart';
import { createOrder } from '@/shared/api/orders';
import { removeAccessToken } from '@/shared/lib/token';
import type { Product } from '@/shared/types/product';

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      return (
        sum +
        Number(item.product.price) * item.quantity
      );
    }, 0);
  }, [items]);

  const loadCart = async () => {
    try {
      const data = await getCart();

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
    loadCart();
  }, []);

  const handleUpdateQuantity = async (
    productId: number,
    quantity: number | null,
  ) => {
    if (!quantity) return;

    try {
      await updateCartItem(productId, quantity);

      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item,
        ),
      );

      message.success('Количество обновлено');
    } catch {
      message.error(
        'Не удалось обновить количество',
      );
    }
  };

  const handleRemove = async (
    productId: number,
  ) => {
    try {
      await removeCartItem(productId);

      setItems((prev) =>
        prev.filter(
          (item) =>
            item.product.id !== productId,
        ),
      );

      message.success(
        'Товар удалён из корзины',
      );
    } catch {
      message.error(
        'Не удалось удалить товар',
      );
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();

      setItems([]);

      message.success('Корзина очищена');
    } catch {
      message.error(
        'Не удалось очистить корзину',
      );
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      message.warning('Корзина пустая');
      return;
    }

    try {
      setCheckoutLoading(true);

      await createOrder();

      setItems([]);

      message.success(
        'Заказ успешно оформлен',
      );

      router.push('/orders');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message;

      if (Array.isArray(errorMessage)) {
        message.error(errorMessage[0]);
      } else {
        message.error(
          errorMessage ||
            'Не удалось оформить заказ',
        );
      }
    } finally {
      setCheckoutLoading(false);
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
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-1 shadow-sm">
        <div className="rounded-[22px] bg-white/95 p-6 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography.Title
                level={2}
                className="!mb-1"
              >
                Корзина
              </Typography.Title>

              <Typography.Text type="secondary">
                Товары, которые вы планируете
                купить
              </Typography.Text>
            </div>

            <Popconfirm
              title="Очистить корзину?"
              okText="Да"
              cancelText="Нет"
              onConfirm={handleClear}
            >
              <Button
                danger
                disabled={items.length === 0}
              >
                Очистить
              </Button>
            </Popconfirm>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <Card className="rounded-3xl shadow-sm">
          <Empty
            image={
              Empty.PRESENTED_IMAGE_SIMPLE
            }
            description="Корзина пустая"
          >
            <Link href="/products">
              <Button type="primary">
                Перейти к товарам
              </Button>
            </Link>
          </Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="rounded-3xl shadow-sm">
            <List
              itemLayout="horizontal"
              dataSource={items}
              renderItem={(item) => (
                <List.Item
                  className="!py-5"
                  actions={[
                    <InputNumber
                      key="quantity"
                      min={1}
                      value={item.quantity}
                      onChange={(value) =>
                        handleUpdateQuantity(
                          item.product.id,
                          value,
                        )
                      }
                    />,
                    <Button
                      key="delete"
                      danger
                      icon={
                        <DeleteOutlined />
                      }
                      onClick={() =>
                        handleRemove(
                          item.product.id,
                        )
                      }
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Image
                        src={
                          item.product
                            .imageUrl || ''
                        }
                        alt={
                          item.product.title
                        }
                        width={110}
                        height={110}
                        className="rounded-2xl object-cover"
                        fallback="https://placehold.co/200x200?text=No+Image"
                      />
                    }
                    title={
                      <Link
                        href={`/products/${item.product.id}`}
                        className="text-lg font-semibold"
                      >
                        {
                          item.product.title
                        }
                      </Link>
                    }
                    description={
                      <div className="space-y-2">
                        <Typography.Paragraph className="!mb-0 text-slate-500">
                          {item.product
                            .description ||
                            'Нет описания'}
                        </Typography.Paragraph>

                        <Typography.Text
                          strong
                          className="text-lg"
                        >
                          {Number(
                            item.product
                              .price,
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

          <Card className="h-fit rounded-3xl shadow-sm">
            <div className="space-y-6">
              <Typography.Title
                level={4}
                className="!mb-0"
              >
                Итог заказа
              </Typography.Title>

              <Statistic
                title="Всего товаров"
                value={items.length}
                prefix={
                  <ShoppingCartOutlined />
                }
              />

              <Statistic
                title="Общая сумма"
                value={total}
                suffix="₸"
                prefix={<WalletOutlined />}
              />

              <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <CheckCircleOutlined />
                  Безопасная покупка
                </div>

                Все платежи и заказы защищены
                системой Mini Marketplace
              </div>

              <Button
                type="primary"
                size="large"
                block
                loading={checkoutLoading}
                onClick={handleCheckout}
                className="!h-14 !rounded-2xl !text-base !font-semibold"
              >
                Оформить заказ
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}