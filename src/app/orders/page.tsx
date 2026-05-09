"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Empty,
  List,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { ShoppingOutlined, WalletOutlined } from "@ant-design/icons";

import { getMyOrders } from "@/shared/api/orders";

interface OrderItem {
  id: number;
  quantity: number;
  price: string | number;
  product: {
    id: number;
    title: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  totalPrice: string | number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
}

const getOrderStatusLabel = (status: Order["status"]) => {
  switch (status) {
    case "PAID":
      return "Оплачен";

    case "CANCELLED":
      return "Отменён";

    case "PENDING":
    default:
      return "Ожидает";
  }
};

const getOrderStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "PAID":
      return "green";

    case "CANCELLED":
      return "red";

    case "PENDING":
    default:
      return "blue";
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <Typography.Title level={2} className="!mb-1">
          Мои заказы
        </Typography.Title>
        <Typography.Text type="secondary">
          История оформленных заказов
        </Typography.Text>
      </section>

      {orders.length === 0 ? (
        <Card className="rounded-3xl shadow-sm">
          <Empty description="Заказов пока нет">
            <Link href="/products">
              <Button type="primary">Перейти к товарам</Button>
            </Link>
          </Empty>
        </Card>
      ) : (
        <List
          dataSource={orders}
          renderItem={(order) => (
            <Card key={order.id} className="mb-4 rounded-3xl shadow-sm">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <Typography.Title level={4} className="!mb-1">
                    Заказ #{order.id}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography.Text>
                </div>

                <div className="flex items-center gap-3">
                  <Tag color={getOrderStatusColor(order.status)}>
                    {getOrderStatusLabel(order.status)}
                  </Tag>
                  <Statistic
                    title="Сумма"
                    value={Number(order.totalPrice)}
                    suffix="₸"
                    prefix={<WalletOutlined />}
                  />
                </div>
              </div>

              <List
                dataSource={order.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <ShoppingOutlined className="text-2xl text-blue-600" />
                      }
                      title={
                        <Link href={`/products/${item.product.id}`}>
                          {item.product.title}
                        </Link>
                      }
                      description={
                        <span>
                          Количество: {item.quantity} · Цена:{" "}
                          {Number(item.price).toLocaleString()} ₸
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}
        />
      )}
    </div>
  );
}
