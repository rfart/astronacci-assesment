import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { userService, UserStats } from '../../services/userService';
import CreateArticle from './components/CreateArticle';
import CreateVideo from './components/CreateVideo';
import ContentAnalytics from './components/ContentAnalytics';
import UserManagement from './components/UserManagement';

interface ArticleForm {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  featuredImage: string;
}

interface VideoForm {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  tags: string;
  duration: string;
}

// --- CMS Dashboard Additions ---
interface CMSStats {
  statistics: {
    totalArticles: number;
    totalVideos: number;
    totalUsers: number;
    totalCategories: number;
    publishedArticles: number;
    publishedVideos: number;
  };
  recentContent: {
    articles: any[];
    videos: any[];
  };
  topCategories: any[];
}

interface ContentAnalytics {
  topArticles: any[];
  topVideos: any[];
  contentCreationTrend: any[];
  period: string;
}

interface UserList {
  _id: string;
  name: string;
  email: string;
  role: string;
  membershipTier: string;
  createdAt: string;
}

const TABS = [
  { key: 'create-article', label: 'Create Article' },
  { key: 'create-video', label: 'Create Video' },
  { key: 'analytics', label: 'Content Analytics' },
  { key: 'users', label: 'User Management', adminOnly: true },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [form, setForm] = useState<ArticleForm>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featuredImage: ''
  });
  const [videoForm, setVideoForm] = useState<VideoForm>({
    title: '',
    description: '',
    url: '',
    thumbnail: '',
    category: '',
    tags: '',
    duration: ''
  });
  const [cmsStats, setCmsStats] = useState<CMSStats | null>(null);
  const [analytics, setAnalytics] = useState<ContentAnalytics | null>(null);
  const [users, setUsers] = useState<UserList[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create-article');
  const [videoMessage, setVideoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Check if user has permission to create articles
  const canCreateArticles = user?.role === 'admin' || user?.role === 'editor';

  // Fetch user stats on component mount
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        setStatsLoading(true);
        const stats = await userService.getMyStats();
        setUserStats(stats);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  // Fetch CMS dashboard stats
  useEffect(() => {
    const fetchCmsStats = async () => {
      try {
        const res = await api.get('/cms/dashboard');
        setCmsStats(res.data.data);
      } catch (e) {
        // ignore for now
      }
    };
    if (user && canCreateArticles) fetchCmsStats();
  }, [user, canCreateArticles]);

  // Fetch content analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Use correct backend endpoint for analytics
        const res = await api.get('/cms/analytics');
        setAnalytics(res.data.data);
      } catch (e) {
        setAnalytics(null); // Show no data if error
      }
    };
    if (user && canCreateArticles) fetchAnalytics();
  }, [user, canCreateArticles]);

  // Fetch users (admin only)
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await api.get('/users');
        setUsers(res.data.data);
      } catch (e) {
        // ignore for now
      } finally {
        setUsersLoading(false);
      }
    };
    if (user?.role === 'admin') fetchUsers();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateArticles) {
      setMessage({ type: 'error', text: 'You do not have permission to create articles' });
      return;
    }

    // Validate required fields
    if (!form.title.trim() || !form.content.trim() || !form.excerpt.trim() || !form.category.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields (Title, Excerpt, Content, and Category)' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const articleData = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await api.post('/articles', articleData);
      
      console.log('Article created:', response.data);
      setMessage({ type: 'success', text: 'Article created successfully!' });
      
      // Refresh user stats after successful creation
      try {
        const stats = await userService.getMyStats();
        setUserStats(stats);
      } catch (error) {
        console.error('Failed to refresh user stats:', error);
      }
      
      // Reset form
      setForm({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        featuredImage: ''
      });

    } catch (error: any) {
      const errorMessage = error.response?.data?.message ?? 'Failed to create article';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields for video
    if (!videoForm.title.trim() || !videoForm.description.trim() || !videoForm.url.trim() || !videoForm.thumbnail.trim() || !videoForm.category.trim() || !videoForm.duration.trim()) {
      setVideoMessage({ type: 'error', text: 'Please fill in all required fields (Title, Description, URL, Thumbnail, Category, and Duration)' });
      return;
    }
    setVideoLoading(true);
    setVideoMessage(null);
    try {
      const videoData = {
        ...videoForm,
        duration: Number(videoForm.duration),
        tags: videoForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      await api.post('/videos', videoData);
      setVideoMessage({ type: 'success', text: 'Video created successfully!' });
      // Reset form
      setVideoForm({
        title: '',
        description: '',
        url: '',
        thumbnail: '',
        category: '',
        tags: '',
        duration: ''
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ?? 'Failed to create video';
      setVideoMessage({ type: 'error', text: errorMessage });
    } finally {
      setVideoLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVideoForm({
      ...videoForm,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* CMS Stats - always visible at the top */}
      {cmsStats && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow border">
            <div className="text-xs text-gray-500">Total Articles</div>
            <div className="text-xl font-bold">{cmsStats.statistics.totalArticles}</div>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <div className="text-xs text-gray-500">Total Videos</div>
            <div className="text-xl font-bold">{cmsStats.statistics.totalVideos}</div>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <div className="text-xs text-gray-500">Total Users</div>
            <div className="text-xl font-bold">{cmsStats.statistics.totalUsers}</div>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <div className="text-xs text-gray-500">Total Categories</div>
            <div className="text-xl font-bold">{cmsStats.statistics.totalCategories}</div>
          </div>
        </div>
      )}
      {/* Navigation Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        {TABS.filter(tab => !tab.adminOnly || user?.role === 'admin').map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'create-article' && (
        <CreateArticle
          canCreateArticles={canCreateArticles}
          userStats={userStats}
          statsLoading={statsLoading}
          message={message}
          form={form}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}
      {activeTab === 'create-video' && (
        <CreateVideo
          cmsStats={cmsStats}
          form={videoForm}
          loading={videoLoading}
          message={videoMessage}
          handleChange={handleVideoChange}
          handleSubmit={handleVideoSubmit}
        />
      )}
      {activeTab === 'analytics' && (
        <ContentAnalytics analytics={analytics} cmsStats={cmsStats} />
      )}
      {activeTab === 'users' && user?.role === 'admin' && (
        <UserManagement users={users} usersLoading={usersLoading} />
      )}

      {/* Quick Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Alternative Upload Methods:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• <strong>Swagger API:</strong> Go to <a href="http://localhost:5001/api-docs" target="_blank" rel="noopener noreferrer" className="underline">http://localhost:5001/api-docs</a></li>
          <li>• <strong>Direct API:</strong> POST to /api/articles with JWT token</li>
          <li>• <strong>cURL:</strong> Use command line with proper authentication</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
