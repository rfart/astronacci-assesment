import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { userService, UserStats } from '../services/userService';

interface ArticleForm {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  featuredImage: string;
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
  { key: 'create', label: 'Create Content' },
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
  const [cmsStats, setCmsStats] = useState<CMSStats | null>(null);
  const [analytics, setAnalytics] = useState<ContentAnalytics | null>(null);
  const [users, setUsers] = useState<UserList[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

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
        const res = await api.get('/cms/analytics');
        setAnalytics(res.data.data);
      } catch (e) {
        // ignore for now
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
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
      {/* Navigation Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        {TABS.filter(tab => !tab.adminOnly || user?.role === 'admin').map(tab => (
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
      {activeTab === 'create' && (
        <>
          {/* --- CMS Dashboard Stats --- */}
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
          {/* --- Content Creation Form --- */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Create New Article</h1>
            <p className="mt-2 text-sm text-gray-700">
              Welcome back, {user.name}! Your role: <span className="font-medium capitalize">{user.role}</span>
            </p>
            
            {/* Article Limits Display */}
            {!statsLoading && userStats && canCreateArticles && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Article Creation Status</h3>
                <div className="text-sm text-blue-800">
                  <p>✨ Unlimited article creation (Dashboard Access)</p>
                  <p className="text-green-600">
                    Articles created: <span className="font-medium">{userStats.created.articles}</span>
                  </p>
                </div>
              </div>
            )}

            {!canCreateArticles && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800">
                  You need admin or editor permissions to create articles. 
                  Current role: <span className="font-medium capitalize">{user.role}</span>
                </p>
              </div>
            )}

            {canCreateArticles && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Create New Article</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {message && (
                    <div className={`rounded-md p-4 ${
                      message.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={form.title}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Enter article title"
                    />
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                      Excerpt *
                    </label>
                    <textarea
                      name="excerpt"
                      id="excerpt"
                      rows={2}
                      required
                      value={form.excerpt}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Brief summary of the article"
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content *
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      rows={10}
                      required
                      value={form.content}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Write your article content here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="category"
                        required
                        value={form.category}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="e.g., technology, health, business"
                      />
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        id="tags"
                        value={form.tags}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="tag1, tag2, tag3"
                      />
                      <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      name="featuredImage"
                      id="featuredImage"
                      value={form.featuredImage}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !canCreateArticles}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating...' : 'Create Article'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </>
      )}
      {activeTab === 'analytics' && (
        <>
          {/* --- Content Analytics --- */}
          {analytics && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Content Analytics (last {analytics.period})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow border">
                  <div className="font-medium mb-2">Top Articles</div>
                  <ul className="text-sm">
                    {analytics.topArticles.map((a: any) => (
                      <li key={a._id}>{a.title} <span className="text-gray-500">({a.views} views)</span></li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow border">
                  <div className="font-medium mb-2">Top Videos</div>
                  <ul className="text-sm">
                    {analytics.topVideos.map((v: any) => (
                      <li key={v._id}>{v.title} <span className="text-gray-500">({v.views} views)</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
                <div className="font-medium mb-2">Content Creation Trend</div>
                <ul className="flex flex-wrap gap-2 text-xs">
                  {analytics.contentCreationTrend.map((d: any) => (
                    <li key={d._id} className="bg-blue-100 px-2 py-1 rounded">{d._id}: {d.articles} articles</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* --- Recent Content & Top Categories --- */}
          {cmsStats && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow border">
                <div className="font-medium mb-2">Recent Articles</div>
                <ul className="text-sm">
                  {cmsStats.recentContent.articles.map((a: any) => (
                    <li key={a._id}>{a.title} <span className="text-gray-500">by {a.author?.name}</span></li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded shadow border">
                <div className="font-medium mb-2">Top Categories</div>
                <ul className="text-sm">
                  {cmsStats.topCategories.map((c: any) => (
                    <li key={c._id}>{c.name} <span className="text-gray-500">({c.totalContent} items)</span></li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
      {activeTab === 'users' && user?.role === 'admin' && (
        <>
          {/* --- User Management (Admin) --- */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">User Management</h2>
            {usersLoading ? (
              <div>Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 border">Name</th>
                      <th className="px-2 py-1 border">Email</th>
                      <th className="px-2 py-1 border">Role</th>
                      <th className="px-2 py-1 border">Membership</th>
                      <th className="px-2 py-1 border">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td className="px-2 py-1 border">{u.name}</td>
                        <td className="px-2 py-1 border">{u.email}</td>
                        <td className="px-2 py-1 border capitalize">{u.role}</td>
                        <td className="px-2 py-1 border">{u.membershipTier}</td>
                        <td className="px-2 py-1 border">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
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
