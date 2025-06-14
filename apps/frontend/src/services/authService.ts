import api from '../utils/api';
import { MembershipTier } from '@astronacci/shared';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  membershipType: MembershipTier;
  role: 'user' | 'editor' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export const authService = {
  // Register with email and password
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Login with email and password
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  // Update membership
  updateMembership: async (membershipType: MembershipTier): Promise<User> => {
    const response = await api.put('/auth/membership', { membershipType });
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  },

  // OAuth URLs
  getGoogleAuthUrl: (): string => `${process.env.REACT_APP_API_URL ?? 'http://localhost:5001/api'}/auth/google`,
  getFacebookAuthUrl: (): string => `${process.env.REACT_APP_API_URL ?? 'http://localhost:5001/api'}/auth/facebook`,
};
