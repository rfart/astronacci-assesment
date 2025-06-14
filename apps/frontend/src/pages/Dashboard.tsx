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

  // Check if user has permission to create articles
  const canCreateArticles = user?.role === 'admin' || user?.role === 'editor';
  const hasReachedArticleLimit = userStats && !userStats.canCreateMore.articles;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateArticles) {
      setMessage({ type: 'error', text: 'You do not have permission to create articles' });
      return;
    }

    // Check if user has reached article limit
    if (hasReachedArticleLimit) {
      setMessage({ type: 'error', text: 'You have reached your article creation limit. Please upgrade your membership to create more articles.' });
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">CMS Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back, {user.name}! Your role: <span className="font-medium capitalize">{user.role}</span>
        </p>
        
        {/* Article Limits Display */}
        {!statsLoading && userStats && canCreateArticles && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Article Creation Status</h3>
            <div className="text-sm text-blue-800">
              {userStats.limits.articles === -1 ? (
                <p>✨ Unlimited articles (Premium membership)</p>
              ) : (
                <div>
                  <p>
                    Articles created: <span className="font-medium">{userStats.created.articles}</span> / <span className="font-medium">{userStats.limits.articles}</span>
                  </p>
                  {userStats.remaining.articles > 0 ? (
                    <p className="text-green-600">
                      You can create <span className="font-medium">{userStats.remaining.articles}</span> more article{userStats.remaining.articles !== 1 ? 's' : ''}
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">
                      ⚠️ You have reached your article creation limit
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!canCreateArticles && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            You need admin or editor permissions to create articles. 
            Current role: <span className="font-medium capitalize">{user.role}</span>
          </p>
        </div>
      )}

      {canCreateArticles && hasReachedArticleLimit && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Article Creation Limit Reached</h3>
              <p className="mt-1 text-sm text-red-700">
                You have reached your article creation limit for your current membership tier. 
                Please upgrade your membership to create more articles.
              </p>
            </div>
          </div>
        </div>
      )}

      {canCreateArticles && !hasReachedArticleLimit && (
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
