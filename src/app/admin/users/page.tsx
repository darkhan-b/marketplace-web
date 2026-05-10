'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Card,
  Empty,
  List,
  message,
  Select,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { getUsers, updateUserRole } from '@/shared/api/users';
import { getRoleColor, getRoleLabel } from '@/shared/lib/role';
import { useAuth } from '@/shared/providers/AuthProvider';
import type { User, UserRole } from '@/shared/types/user';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuth, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      message.error('Не удалось загрузить пользователей');
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

    loadUsers();
  }, [authLoading, isAuth, user?.role, router]);

  const handleRoleChange = async (userId: number, role: UserRole) => {
    try {
      const updatedUser = await updateUserRole(userId, role);

      setUsers((prev) =>
        prev.map((item) => (item.id === userId ? updatedUser : item)),
      );

      message.success('Роль пользователя обновлена');
    } catch {
      message.error('Не удалось обновить роль');
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
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="rounded-3xl shadow-sm">
        <Typography.Title level={2} className="mb-1">
          Пользователи
        </Typography.Title>

        <Typography.Text type="secondary">
          Управление ролями пользователей
        </Typography.Text>
      </Card>

      <Card className="rounded-1xl shadow-sm" >
        {users.length === 0 ? (
          <Empty description="Пользователей пока нет" />
        ) : (
          <List
            dataSource={users}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Select
                    key="role"
                    value={item.role}
                    style={{ width: 180 }}
                    onChange={(value) =>
                      handleRoleChange(item.id, value as UserRole)
                    }
                    options={[
                      { label: 'Пользователь', value: 'USER' },
                      { label: 'Продавец', value: 'SELLER' },
                      { label: 'Администратор', value: 'ADMIN' },
                    ]}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar icon={<UserOutlined />} className="!bg-blue-600" />
                  }
                  title={
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{item.name || 'Без имени'}</span>

                      <Tag color={getRoleColor(item.role)}>
                        {getRoleLabel(item.role)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <div>{item.email}</div>
                      <div className="text-xs text-slate-500">
                        ID: {item.id} · Зарегистрирован:{' '}
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
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