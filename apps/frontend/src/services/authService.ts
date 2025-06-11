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
  data: User;
  token?: string;
  message?: string;
}

export const authService = {
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
  getGoogleAuthUrl: (): string => `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`,
  getFacebookAuthUrl: (): string => `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/facebook`,
};
