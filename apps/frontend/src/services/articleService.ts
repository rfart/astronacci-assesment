import api from '../utils/api';

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  category: string;
  tags: string[];
  featuredImage?: string;
  isPublished: boolean;
  views: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  success: boolean;
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export const articleService = {
  // Get all articles
  getArticles: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<ArticlesResponse> => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  // Get single article
  getArticle: async (id: string): Promise<Article> => {
    const response = await api.get(`/articles/${id}`);
    return response.data.data;
  },

  // Create article (Admin/Editor)
  createArticle: async (articleData: Partial<Article>): Promise<Article> => {
    const response = await api.post('/articles', articleData);
    return response.data.data;
  },

  // Update article (Admin/Editor)
  updateArticle: async (id: string, articleData: Partial<Article>): Promise<Article> => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data.data;
  },

  // Delete article (Admin)
  deleteArticle: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },
};
