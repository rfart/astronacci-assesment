import React from 'react';

interface Props {
  canCreateArticles: boolean;
  userStats: any;
  statsLoading: boolean;
  message: { type: 'success' | 'error', text: string } | null;
  form: any;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CreateContent: React.FC<Props> = ({
  canCreateArticles,
  userStats,
  statsLoading,
  message,
  form,
  loading,
  handleChange,
  handleSubmit,
}) => {
  return (
    <>
      {/* Content Creation Form and User Stats */}
      {canCreateArticles && (
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
      )}
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
    </>
  );
};

// Rename the component and export as CreateArticle
const CreateArticle = CreateContent;
export default CreateArticle;
