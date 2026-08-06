const API_BASE_URL = 'http://localhost:8081/api';

// Helper to get authorization headers if token exists
const getHeaders = (optionsHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...optionsHeaders,
  };
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }
  return headers;
};

// Generic request wrapper
const request = async (url, options = {}) => {
  const config = {
    ...options,
    headers: getHeaders(options.headers),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Check if the response is empty (e.g., 204 No Content or successful delete)
    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = text;
      }
    }

    if (!response.ok) {
      const errorMessage = (data && (data.message || data.error)) || `HTTP error! Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error.message);
    throw error;
  }
};

const api = {
  // Authentication
  auth: {
    signin: (username, password) => 
      request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    signup: (signupData) =>
      request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData),
      }),
    logout: () => {
      localStorage.removeItem('user');
    },
    getCurrentUser: () => {
      return JSON.parse(localStorage.getItem('user'));
    },
  },

  // Homepage
  home: {
    getHomepageData: () => request('/home'),
    getCategories: () => request('/home/categories'),
    getFeaturedProducts: () => request('/home/featured'),
    getLatestProducts: () => request('/home/latest'),
    getBanners: () => request('/home/banners'),
  },

  // Products
  products: {
    getAll: ({ page = 0, size = 12, sortBy = 'id', sortDir = 'asc', search = '', categoryId = '' } = {}) => {
      const query = new URLSearchParams();
      query.append('page', page);
      query.append('size', size);
      query.append('sortBy', sortBy);
      query.append('sortDir', sortDir);
      if (search) query.append('search', search);
      if (categoryId) query.append('categoryId', categoryId);
      return request(`/products?${query.toString()}`);
    },
    getById: (id) => request(`/products/${id}`),
    create: (productData) =>
      request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),
    update: (id, productData) =>
      request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      }),
    updateImage: (id, imageUrl) =>
      request(`/products/${id}/image`, {
        method: 'PUT',
        body: JSON.stringify({ imageUrl }),
      }),
    delete: (id) =>
      request(`/products/${id}`, {
        method: 'DELETE',
      }),
  },

  // Categories (Admins)
  categories: {
    getAll: ({ page = 0, size = 100, sortBy = 'id', sortDir = 'asc' } = {}) => {
      const query = new URLSearchParams({ page, size, sortBy, sortDir });
      return request(`/categories?${query.toString()}`);
    },
    getById: (id) => request(`/categories/${id}`),
    create: (categoryData) =>
      request('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      }),
    update: (id, categoryData) =>
      request(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      }),
    delete: (id) =>
      request(`/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  // Shopping Cart
  cart: {
    add: (productId, quantity = 1) =>
      request('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      }),
    getCount: () => request('/cart/items/count'),
    getDetails: () => request('/cart/items'),
    updateQuantity: (productId, quantity) =>
      request('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      }),
    deleteItem: (productId) =>
      request(`/cart/delete/${productId}`, {
        method: 'DELETE',
      }),
  },

  // Orders
  orders: {
    checkout: (shippingAddress) =>
      request('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({ shippingAddress }),
      }),
    getHistory: () => request('/orders'),
    getHistoryStructured: () => request('/orders/history'),
    getDetails: (orderId) => request(`/orders/${orderId}`),
    updateStatus: (orderId, status) =>
      request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  // Payments
  payments: {
    process: (paymentData) =>
      request('/payment/process', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      }),
    getByOrderId: (orderId) => request(`/payment/order/${orderId}`),
  },

  // Razorpay Payments
  razorpay: {
    createOrder: (amount) =>
      request('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
    verify: (verifyData) =>
      request('/payment/verify', {
        method: 'POST',
        body: JSON.stringify(verifyData),
      }),
  },

  // User Profile
  profile: {
    get: () => request('/profile'),
    update: (profileData) =>
      request('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    changePassword: (passwordData) =>
      request('/profile/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
      }),
  },

  // Admin Dashboard (Analytics)
  admin: {
    getStats: () => request('/admin/dashboard/stats'),
    getUsers: ({ page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '' } = {}) => {
      const query = new URLSearchParams({ page, size, sortBy, sortDir });
      if (search) query.append('search', search);
      return request(`/admin/users?${query.toString()}`);
    },
    enableUser: (userId) =>
      request(`/admin/users/${userId}/enable`, {
        method: 'PUT',
      }),
    disableUser: (userId) =>
      request(`/admin/users/${userId}/disable`, {
        method: 'PUT',
      }),
    updateUserRoles: (userId, roles) =>
      request(`/admin/users/${userId}/roles`, {
        method: 'PUT',
        body: JSON.stringify({ roles }),
      }),
  },

  // Wishlist
  wishlist: {
    add: (productId) =>
      request(`/wishlist/${productId}`, {
        method: 'POST',
      }),
    getAll: () => request('/wishlist'),
    remove: (productId) =>
      request(`/wishlist/${productId}`, {
        method: 'DELETE',
      }),
    getCount: () => request('/wishlist/count'),
  },
};

export default api;
