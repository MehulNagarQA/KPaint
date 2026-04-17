import { create } from 'zustand';
import type { Cart } from '../types';
import { cartAPI } from '../api';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (paintingId: string, quantity?: number) => Promise<void>;
  updateQuantity: (paintingId: string, quantity: number) => Promise<void>;
  removeFromCart: (paintingId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await cartAPI.get();
      if (data.success) {
        set({ cart: data.cart });
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (paintingId, quantity = 1) => {
    try {
      const { data } = await cartAPI.add(paintingId, quantity);
      if (data.success) {
        set({ cart: data.cart });
      }
    } catch (error) {
      console.error('Failed to add to cart', error);
      throw error;
    }
  },

  updateQuantity: async (paintingId, quantity) => {
    try {
      const { data } = await cartAPI.update(paintingId, quantity);
      if (data.success) {
        set({ cart: data.cart });
      }
    } catch (error) {
      console.error('Failed to update cart', error);
      throw error;
    }
  },

  removeFromCart: async (paintingId) => {
    try {
      const { data } = await cartAPI.remove(paintingId);
      if (data.success) {
        set({ cart: data.cart });
      }
    } catch (error) {
      console.error('Failed to remove item', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await cartAPI.clear();
      set({ cart: null });
    } catch (error) {
      console.error('Failed to clear cart', error);
      throw error;
    }
  }
}));
