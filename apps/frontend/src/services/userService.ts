import api from '../utils/api';

export interface UserStats {
  user: {
    membershipTier: string;
    role: string;
  };
  created: {
    articles: number;
    videos: number;
  };
  limits: {
    articles: number;
    videos: number;
  };
  remaining: {
    articles: number;
    videos: number;
  };
  canCreateMore: {
    articles: boolean;
    videos: boolean;
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: UserStats;
}

export const userService = {
  // Get current user's creation stats and limits
  getMyStats: async (): Promise<UserStats> => {
    const response = await api.get('/users/my-stats');
    return response.data.data;
  },
};
