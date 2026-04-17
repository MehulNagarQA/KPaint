import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kpaint_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('kpaint_token');
      localStorage.removeItem('kpaint_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  toggleWishlist: (paintingId: string) =>
    api.post(`/auth/wishlist/${paintingId}`),
};

// ─── Paintings API ────────────────────────────────────────────────────────────
export const paintingsAPI = {
  getAll: (params?: Record<string, any>) =>
    api.get('/paintings', { params }),
  getById: (id: string) => api.get(`/paintings/${id}`),
  create: (formData: FormData) =>
    api.post('/paintings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.put(`/paintings/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/paintings/${id}`),
};

// ─── Cart API ─────────────────────────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (paintingId: string, quantity = 1) =>
    api.post('/cart', { paintingId, quantity }),
  update: (paintingId: string, quantity: number) =>
    api.put(`/cart/${paintingId}`, { quantity }),
  remove: (paintingId: string) => api.delete(`/cart/${paintingId}`),
  clear: () => api.delete('/cart/clear'),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersAPI = {
  place: (shippingAddress: object) =>
    api.post('/orders', { shippingAddress }),
  getMyOrders: () => api.get('/orders/my'),
  getAllOrders: () => api.get('/orders'),
  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

export default api;
