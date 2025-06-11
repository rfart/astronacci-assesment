import api from '../utils/api';

export interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  category: {
    _id: string;
    name: string;
  };
  tags: string[];
  isPublished: boolean;
  views: any[];
  createdAt: string;
  updatedAt: string;
}

export interface VideosResponse {
  success: boolean;
  data: Video[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export const videoService = {
  // Get all videos
  getVideos: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<VideosResponse> => {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  // Get single video
  getVideo: async (id: string): Promise<Video> => {
    const response = await api.get(`/videos/${id}`);
    return response.data.data;
  },

  // Create video (Admin/Editor)
  createVideo: async (videoData: Partial<Video>): Promise<Video> => {
    const response = await api.post('/videos', videoData);
    return response.data.data;
  },

  // Update video (Admin/Editor)
  updateVideo: async (id: string, videoData: Partial<Video>): Promise<Video> => {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data.data;
  },

  // Delete video (Admin)
  deleteVideo: async (id: string): Promise<void> => {
    await api.delete(`/videos/${id}`);
  },
};
