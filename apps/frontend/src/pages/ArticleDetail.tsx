import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleService, Article } from '../services/articleService';

// Utility function to calculate reading time
const calculateReadingTime = (content: string): number => {
  if (!content || typeof content !== 'string') {
    return 1;
  }
  
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Utility function to format content with better paragraph handling
const formatContent = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return '<p>No content available.</p>';
  }
  
  return content
    .split('\n')
    .filter(paragraph => paragraph.trim() !== '')
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('');
};

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError('Article ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const articleData = await articleService.getArticle(id);
        setArticle(articleData);
      } catch (error: any) {
        console.error('Failed to fetch article:', error);
        if (error.response?.data?.code === 'DAILY_LIMIT_REACHED') {
          setError(error.response.data.message);
        } else {
          setError(error.response?.data?.message ?? 'Failed to load article');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {error?.includes('Daily') ? 'Daily Limit Reached' : 'Article not found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Link
              to="/articles"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              ← Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Article not found</h3>
          <p className="mt-1 text-sm text-gray-500">The article you're looking for doesn't exist or couldn't be loaded.</p>
          <div className="mt-6">
            <Link
              to="/articles"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              ← Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Article Header */}
        <article className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="aspect-video w-full">
              <img
                className="w-full h-full object-cover"
                src={article.featuredImage}
                alt={article.title}
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Category and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {article.category}
                </span>
              )}
              {article.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {article.title ?? 'Untitled Article'}
            </h1>

            {/* Article Meta */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {article.author?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{article.author?.name ?? 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{article.author?.email ?? ''}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-4 text-sm text-gray-500">
                  <span>{calculateReadingTime(article.content ?? '')} min read</span>
                  <span>•</span>
                  <span>
                    Published on {new Date(article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {article.updatedAt !== article.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Updated on {new Date(article.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {/* Excerpt if available */}
              {article.excerpt && (
                <div className="text-xl text-gray-600 font-light mb-8 leading-relaxed italic border-l-4 border-primary-500 pl-6">
                  {article.excerpt}
                </div>
              )}

              {/* Main Content */}
              <div 
                className="article-content text-gray-800 leading-relaxed"
                style={{ 
                  lineHeight: '1.8',
                  fontSize: '18px'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(article.content ?? '')
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              {/* Social Sharing */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Share this article</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: article.title ?? 'Article',
                          text: article.excerpt ?? '',
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                  
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title ?? 'Article')}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Tweet
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-blue-600 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{article.views?.length ?? 0} views</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Link
                    to="/articles"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    ← Back to Articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
