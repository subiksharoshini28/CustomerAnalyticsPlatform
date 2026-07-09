import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getTopProducts: (count) => api.get(`/products/top/${count}`),
  getRecommendations: (id) => api.get(`/products/${id}/recommendations`),
  getPopular: (count) => api.get('/products/popular', { params: { count } }),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (productId, quantity) => api.put(`/cart/${productId}`, quantity),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getByNumber: (orderNumber) => api.get(`/orders/number/${orderNumber}`),
  getMyOrders: (params) => api.get('/orders', { params }),
};

// Events API
export const eventsAPI = {
  track: (data) => api.post('/events', data),
  getTimeline: () => api.get('/events/timeline'),
  getJourney: () => api.get('/events/journey'),
};

// Analytics API
export const analyticsAPI = {
  getCustomerJourney: (customerId) => api.get('/analytics/customerjourney', { params: { customerId } }),
  getChurnPredictions: () => api.get('/analytics/churn'),
  getSegments: () => api.get('/analytics/segments'),
  getCohortAnalysis: () => api.get('/analytics/cohort'),
  getConversionFunnel: () => api.get('/analytics/funnel'),
  getChannelPerformance: () => api.get('/analytics/channels'),
  getHeatmapData: () => api.get('/analytics/heatmap'),
  getRecentActivity: (count) => api.get('/analytics/activity', { params: { count } }),
};

// Dashboard API
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
  getStats: () => api.get('/dashboard/stats'),
  getRevenueChart: (days) => api.get('/dashboard/revenue', { params: { days } }),
  getTopProducts: (count) => api.get('/dashboard/top-products', { params: { count } }),
  getCategories: () => api.get('/dashboard/categories'),
  getAttribution: () => api.get('/dashboard/attribution'),
  getRecommendations: () => api.get('/dashboard/recommendations'),
};

export default api;
