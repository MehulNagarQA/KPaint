// ─── Data Types ───────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  wishlist?: any[];
}

export interface Painting {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  imagePublicId?: string;
  category: string;
  artist: string;
  dimensions?: string;
  medium?: string;
  stock: number;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  painting: Painting;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

export interface OrderItem {
  painting: Painting;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

export const CATEGORIES = [
  'Abstract',
  'Landscape',
  'Portrait',
  'Still Life',
  'Modern',
  'Watercolor',
  'Oil',
  'Digital',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
