export enum MembershipTier {
  TYPE_A = 'TYPE_A',
  TYPE_B = 'TYPE_B', 
  TYPE_C = 'TYPE_C'
}

export enum ContentType {
  ARTICLE = 'article',
  VIDEO = 'video'
}

export enum UserRole {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

export interface MembershipLimits {
  articles: number;
  videos: number;
}

export const MEMBERSHIP_LIMITS: Record<MembershipTier, MembershipLimits> = {
  [MembershipTier.TYPE_A]: { articles: 3, videos: 3 },
  [MembershipTier.TYPE_B]: { articles: 10, videos: 10 },
  [MembershipTier.TYPE_C]: { articles: -1, videos: -1 } // -1 means unlimited
};

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  membershipTier: MembershipTier;
  role: UserRole;
  socialProvider: 'google' | 'facebook' | 'local';
  socialId?: string;
  articlesRead: number;
  videosWatched: number;
  dailyArticlesAccessed: number;
  dailyVideosAccessed: number;
  lastAccessDate: Date;
  accessedContentToday: {
    articles: Array<{
      contentId: string;
      accessDate: Date;
    }>;
    videos: Array<{
      contentId: string;
      accessDate: Date;
    }>;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number; // in seconds
  category: string;
  tags: string[];
  featured: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  membershipTier: MembershipTier;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
