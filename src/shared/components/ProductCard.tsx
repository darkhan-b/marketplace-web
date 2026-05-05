'use client';

import Link from 'next/link';
import { Button, Card, Tag, Typography } from 'antd';

import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card
      hoverable
      cover={
        product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
            Нет изображения
          </div>
        )
      }
    >
      <div className="space-y-3">
        <div>
          <Typography.Title level={5} className="!mb-1">
            {product.title}
          </Typography.Title>

          {product.category && <Tag>{product.category.name}</Tag>}
        </div>

        <Typography.Text strong className="text-lg">
          {Number(product.price).toLocaleString()} ₸
        </Typography.Text>

        <div>
          <Link href={`/products/${product.id}`}>
            <Button type="primary" block>
              Подробнее
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};