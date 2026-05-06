'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { login as loginApi, register as registerApi } from '@/shared/api/auth';
import { getMe } from '@/shared/api/users';
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/shared/lib/token';
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
  token: string | null;
  loading: boolean;
  isAuth: boolean;
  login: (body: LoginBody) => Promise<void>;
  register: (body: RegisterBody) => Promise<void>;
  logout: () => void;
  refetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saveToken = (accessToken: string) => {
    setAccessToken(accessToken);
    setTokenState(accessToken);
  };

  const clearAuth = () => {
    removeAccessToken();
    setTokenState(null);
    setUser(null);
  };

  const refetchMe = async () => {
    const me = await getMe();
    setUser(me);
  };

  useEffect(() => {
    const init = async () => {
      const storedToken = getAccessToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setTokenState(storedToken);
        const me = await getMe();
        setUser(me);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (body: LoginBody) => {
    const data = await loginApi(body);

    saveToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (body: RegisterBody) => {
    const data = await registerApi(body);

    saveToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    clearAuth();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuth: Boolean(user && token),
      login,
      register,
      logout,
      refetchMe,
    }),
    [user, token, loading],
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