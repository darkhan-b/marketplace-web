'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  List,
  message,
  Select,
  Spin,
  Tag,
  Typography,
} from 'antd';

import {
  getAllOrders,
  updateOrderStatus,
  type OrderStatus,
} from '@/shared/api/orders';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      message.error('Нет доступа или ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId: number,
    status: OrderStatus,
  ) => {
    try {
      await updateOrderStatus(orderId, status);
      message.success('Статус заказа обновлён');
      await loadOrders();
    } catch {
      message.error('Не удалось обновить статус');
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
      <Card className="rounded-3xl shadow-sm">
        <Typography.Title level={2}>
          Админка: заказы
        </Typography.Title>
        <Typography.Text type="secondary">
          Здесь администратор может подтверждать или отменять заказы
        </Typography.Text>
      </Card>

      <List
        dataSource={orders}
        renderItem={(order) => (
          <Card key={order.id} className="mb-4 rounded-3xl shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Typography.Title level={4} className="!mb-1">
                  Заказ #{order.id}
                </Typography.Title>

                <div className="text-slate-500">
                  Пользователь: {order.user?.email}
                </div>

                <div className="text-slate-500">
                  Сумма: {Number(order.totalPrice).toLocaleString()} ₸
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag color="blue">{order.status}</Tag>

                <Select
                  value={order.status}
                  style={{ width: 160 }}
                  onChange={(value) =>
                    handleStatusChange(order.id, value)
                  }
                  options={[
                    { label: 'PENDING', value: 'PENDING' },
                    { label: 'PAID', value: 'PAID' },
                    { label: 'CANCELLED', value: 'CANCELLED' },
                  ]}
                />
              </div>
            </div>

            <div className="mt-4">
              <Typography.Text strong>Товары:</Typography.Text>

              <ul className="mt-2 list-disc pl-5">
                {order.items?.map((item: any) => (
                  <li key={item.id}>
                    {item.product?.title} — {item.quantity} шт. ×{' '}
                    {Number(item.price).toLocaleString()} ₸
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}
      />
    </div>
  );
}