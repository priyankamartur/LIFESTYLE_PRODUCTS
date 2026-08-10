import axiosInstance from '../api/axios';

const apiService = {
  // Authentication
  auth: {
    signin: async (username, password) => {
      const response = await axiosInstance.post('/auth/signin', { username, password });
      return response.data;
    },
    adminSignin: async (username, password) => {
      const response = await axiosInstance.post('/auth/admin/signin', { username, password });
      return response.data;
    },
    signup: async (signupData) => {
      const response = await axiosInstance.post('/auth/signup', signupData);
      return response.data;
    },
    logout: async () => {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    },
    forgotPassword: async (email) => {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    },
    resetPassword: async (email, token, newPassword) => {
      const response = await axiosInstance.post('/auth/reset-password', { email, token, newPassword });
      return response.data;
    },
  },

  // Homepage
  home: {
    getHomepageData: async () => {
      const response = await axiosInstance.get('/home');
      return response.data;
    },
    getCategories: async () => {
      const response = await axiosInstance.get('/home/categories');
      return response.data;
    },
    getFeaturedProducts: async () => {
      const response = await axiosInstance.get('/home/featured');
      return response.data;
    },
    getLatestProducts: async () => {
      const response = await axiosInstance.get('/home/latest');
      return response.data;
    },
    getBanners: async () => {
      const response = await axiosInstance.get('/home/banners');
      return response.data;
    },
  },

  // Products
  products: {
    getAll: async ({ page = 0, size = 12, sortBy = 'id', sortDir = 'asc', search = '', categoryId = '' } = {}) => {
      const params = { page, size, sortBy, sortDir };
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    },
    getById: async (id) => {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    },
    create: async (productData) => {
      const response = await axiosInstance.post('/products', productData);
      return response.data;
    },
    update: async (id, productData) => {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return response.data;
    },
    updateImage: async (id, imageUrl) => {
      const response = await axiosInstance.put(`/products/${id}/image`, { imageUrl });
      return response.data;
    },
    delete: async (id) => {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    },
  },

  // Categories
  categories: {
    getAll: async ({ page = 0, size = 100, sortBy = 'id', sortDir = 'asc' } = {}) => {
      const params = { page, size, sortBy, sortDir };
      const response = await axiosInstance.get('/categories', { params });
      return response.data;
    },
    getById: async (id) => {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
    },
    create: async (categoryData) => {
      const response = await axiosInstance.post('/categories', categoryData);
      return response.data;
    },
    update: async (id, categoryData) => {
      const response = await axiosInstance.put(`/categories/${id}`, categoryData);
      return response.data;
    },
    delete: async (id) => {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response.data;
    },
  },

  // Shopping Cart
  cart: {
    add: async (productId, quantity = 1) => {
      const response = await axiosInstance.post('/cart/add', { productId, quantity });
      return response.data;
    },
    getCount: async () => {
      const response = await axiosInstance.get('/cart/items/count');
      return response.data;
    },
    getDetails: async () => {
      const response = await axiosInstance.get('/cart/items');
      return response.data;
    },
    updateQuantity: async (productId, quantity) => {
      const response = await axiosInstance.put('/cart/update', { productId, quantity });
      return response.data;
    },
    deleteItem: async (productId) => {
      const response = await axiosInstance.delete(`/cart/delete/${productId}`);
      return response.data;
    },
  },

  // Orders
  orders: {
    checkout: async (shippingAddress) => {
      const response = await axiosInstance.post('/orders/checkout', { shippingAddress });
      return response.data;
    },
    getHistory: async () => {
      const response = await axiosInstance.get('/orders');
      return response.data;
    },
    getHistoryStructured: async () => {
      const response = await axiosInstance.get('/orders/history');
      return response.data;
    },
    getDetails: async (orderId) => {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    },
    updateStatus: async (orderId, status) => {
      const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
      return response.data;
    },
  },

  // Payments
  payments: {
    process: async (paymentData) => {
      const response = await axiosInstance.post('/payment/process', paymentData);
      return response.data;
    },
    getByOrderId: async (orderId) => {
      const response = await axiosInstance.get(`/payment/order/${orderId}`);
      return response.data;
    },
  },

  // Razorpay Payments
  razorpay: {
    createOrder: async (amount) => {
      const response = await axiosInstance.post('/payment/create-order', { amount });
      return response.data;
    },
    verify: async (verifyData) => {
      const response = await axiosInstance.post('/payment/verify', verifyData);
      return response.data;
    },
  },

  // User Profile
  profile: {
    get: async () => {
      const response = await axiosInstance.get('/profile');
      return response.data;
    },
    update: async (profileData) => {
      const response = await axiosInstance.put('/profile', profileData);
      return response.data;
    },
    changePassword: async (passwordData) => {
      const response = await axiosInstance.post('/profile/change-password', passwordData);
      return response.data;
    },
  },

  // Admin Controls
  admin: {
    getStats: async () => {
      const response = await axiosInstance.get('/admin/dashboard/stats');
      return response.data;
    },
    getUsers: async ({ page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '' } = {}) => {
      const params = { page, size, sortBy, sortDir };
      if (search) params.search = search;
      const response = await axiosInstance.get('/admin/users', { params });
      return response.data;
    },
    enableUser: async (userId) => {
      const response = await axiosInstance.put(`/admin/users/${userId}/enable`);
      return response.data;
    },
    disableUser: async (userId) => {
      const response = await axiosInstance.put(`/admin/users/${userId}/disable`);
      return response.data;
    },
    // Products Management
    getProducts: async ({ page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '', categoryId = '' } = {}) => {
      const params = { page, size, sortBy, sortDir };
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      const response = await axiosInstance.get('/admin/products', { params });
      return response.data;
    },
    createProduct: async (productData) => {
      const response = await axiosInstance.post('/admin/products', productData);
      return response.data;
    },
    updateProduct: async (id, productData) => {
      const response = await axiosInstance.put(`/admin/products/${id}`, productData);
      return response.data;
    },
    deleteProduct: async (id) => {
      const response = await axiosInstance.delete(`/admin/products/${id}`);
      return response.data;
    },
    // Users Management
    createUser: async (userData) => {
      const response = await axiosInstance.post('/admin/users', userData);
      return response.data;
    },
    getUserById: async (userId) => {
      const response = await axiosInstance.get(`/admin/users/${userId}`);
      return response.data;
    },
    updateUser: async (userId, userData) => {
      const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
      return response.data;
    },
    // Analytics Dashboard
    getDailyAnalytics: async (date = '') => {
      const params = {};
      if (date) params.date = date;
      const response = await axiosInstance.get('/admin/analytics/daily', { params });
      return response.data;
    },
    getMonthlyAnalytics: async () => {
      const response = await axiosInstance.get('/admin/analytics/monthly');
      return response.data;
    },
    getYearlyAnalytics: async () => {
      const response = await axiosInstance.get('/admin/analytics/yearly');
      return response.data;
    },
    getOverallAnalytics: async () => {
      const response = await axiosInstance.get('/admin/analytics/overall');
      return response.data;
    },
  },

  // Wishlist
  wishlist: {
    add: async (productId) => {
      const response = await axiosInstance.post(`/wishlist/${productId}`);
      return response.data;
    },
    getAll: async () => {
      const response = await axiosInstance.get('/wishlist');
      return response.data;
    },
    remove: async (productId) => {
      const response = await axiosInstance.delete(`/wishlist/${productId}`);
      return response.data;
    },
    getCount: async () => {
      const response = await axiosInstance.get('/wishlist/count');
      return response.data;
    },
  },
};

export default apiService;
