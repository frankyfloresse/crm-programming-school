import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { store, clearStore } from '../store';

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token from localStorage
axiosInstance.interceptors.request.use((config) => {
  // Don't add auth token for activate-account endpoint
  if (config.url?.includes('/auth/activate-account')) {
    return config;
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token logic - simple localStorage operations
const refreshAuthLogic = async (failedRequest: { response: { config: { headers: Record<string, string>; url?: string } } }) => {
  // Don't try to refresh token for public endpoints
  if (failedRequest.response.config.url?.includes('/auth/login') ||
      failedRequest.response.config.url?.includes('/auth/activate-account')) {
    return Promise.reject(failedRequest);
  }

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    store.dispatch(clearStore());
    return Promise.reject();
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/refresh`, {
      refreshToken,
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    // Update localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    // Update failed request
    failedRequest.response.config.headers['Authorization'] = `Bearer ${accessToken}`;
    
    return Promise.resolve();
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    store.dispatch(clearStore());
    return Promise.reject();
  }
};

// Setup refresh interceptor
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);