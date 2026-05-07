'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { login as loginApi, logout as logoutApi, register as registerApi } from '@/shared/api/auth';
import { getMe } from '@/shared/api/users';
import type { User } from '@/shared/types/user';

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  login: (body: LoginBody) => Promise<void>;
  register: (body: RegisterBody) => Promise<void>;
  logout: () => Promise<void>;
  refetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refetchMe = async () => {
    const me = await getMe();
    setUser(me);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (body: LoginBody) => {
    const user = await loginApi(body);
    setUser(user);
  };

  const register = async (body: RegisterBody) => {
    const user = await registerApi(body);
    setUser(user);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuth: Boolean(user),
      login,
      register,
      logout,
      refetchMe,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};