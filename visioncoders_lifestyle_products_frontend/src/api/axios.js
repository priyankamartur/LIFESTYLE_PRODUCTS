import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Auto-logout on 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config && error.config.url && (
        error.config.url.includes('/auth/signin') || 
        error.config.url.includes('/auth/signup')
      );
      
      if (!isAuthEndpoint) {
        const hasStoredUser = !!localStorage.getItem('user');
        const isPublicPage = ['/', '/home', '/catalog'].includes(window.location.pathname) || window.location.pathname.startsWith('/product/');
        
        if (hasStoredUser) {
          console.warn('Session expired or unauthorized. Logging out...');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('authChange'));
          
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
        } else if (!isPublicPage && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle Network Error (e.g. backend down, missing VITE_API_BASE_URL, or Mixed Content error)
    if (!error.response && error.message === 'Network Error') {
      error.message = 'Unable to reach backend server. Make sure your Java backend is running online and VITE_API_BASE_URL is configured on Vercel.';
    } else if (error.response && error.response.data) {
      const data = error.response.data;
      const message = data.message || data.error || (typeof data === 'string' ? data : '');
      if (message) {
        error.message = message;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
