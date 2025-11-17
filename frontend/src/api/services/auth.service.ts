import { axiosInstance } from '../axiosConfig';
import type { User } from '../../store/auth/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  refresh: async (data: RefreshRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/refresh', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  },

  activateAccount: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/auth/activate-account', data);
    return response.data;
  },
};