import { create } from 'zustand';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    role: 'STUDENT' | 'EMPLOYER';
    fullName?: string;
    companyName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('careva_token'),
  isLoading: true,
  isAuthenticated: !!localStorage.getItem('careva_token'),

  login: async (email, password) => {
    const res = await authApi.login(email, password);
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Login failed');
    }
    localStorage.setItem('careva_token', res.data.token);
    localStorage.setItem('careva_user', JSON.stringify(res.data.user));
    set({
      user: res.data.user,
      token: res.data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  register: async (data) => {
    const res = await authApi.register(data);
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Registration failed');
    }
    localStorage.setItem('careva_token', res.data.token);
    localStorage.setItem('careva_user', JSON.stringify(res.data.user));
    set({
      user: res.data.user,
      token: res.data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('careva_token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const res = await authApi.me();
      if (res.success && res.data?.user) {
        set({
          user: res.data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        localStorage.removeItem('careva_token');
        localStorage.removeItem('careva_user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      localStorage.removeItem('careva_token');
      localStorage.removeItem('careva_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user }),
}));
