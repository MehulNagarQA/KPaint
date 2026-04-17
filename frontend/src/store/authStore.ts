import { create } from 'zustand';
import type { User, Painting } from '../types';
import { authAPI } from '../api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  toggleWishlistIcon: (paintingId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('kpaint_user') || 'null'),
  token: localStorage.getItem('kpaint_token'),
  isAuthenticated: !!localStorage.getItem('kpaint_token'),
  isLoading: true,

  login: (user, token) => {
    localStorage.setItem('kpaint_token', token);
    localStorage.setItem('kpaint_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('kpaint_token');
    localStorage.removeItem('kpaint_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('kpaint_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      
      const { data } = await authAPI.getMe();
      if (data.success && data.user) {
        localStorage.setItem('kpaint_user', JSON.stringify(data.user));
        set({ user: data.user, isAuthenticated: true });
      }
    } catch (error) {
      localStorage.removeItem('kpaint_token');
      localStorage.removeItem('kpaint_user');
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlistIcon: (paintingId) => {
    const { user } = get();
    if (!user) return;
    
    let wishlist = user.wishlist || [];
    if (wishlist.includes(paintingId)) {
      wishlist = wishlist.filter(id => id !== paintingId);
    } else {
      wishlist = [...wishlist, paintingId];
    }
    
    const updatedUser = { ...user, wishlist };
    localStorage.setItem('kpaint_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  }
}));
