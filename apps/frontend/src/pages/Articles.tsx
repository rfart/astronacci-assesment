import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { articleService, Article } from '../services/articleService';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticles({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
      });
      setArticles(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediately update debounced search on form submit
    setDebouncedSearch(search);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
          <p className="mt-2 text-sm text-gray-700">
            Discover our latest articles and insights
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Articles Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/articles/${article._id}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {article.featuredImage && (
              <img
                className="w-full h-48 object-cover"
                src={article.featuredImage}
                alt={article.title}
              />
            )}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {article.author.name}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Articles;
