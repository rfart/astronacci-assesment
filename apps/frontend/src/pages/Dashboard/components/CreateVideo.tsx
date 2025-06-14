import React from 'react';

interface Props {
  form: any;
  loading: boolean;
  message: { type: 'success' | 'error', text: string } | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  cmsStats?: any;
}

const CreateVideo: React.FC<Props> = ({ form, loading, message, handleChange, handleSubmit, cmsStats }) => {
  return (
    <>
      {/* Video Form */}
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
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            required
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Brief description of the video"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Video URL *
          </label>
          <input
            type="url"
            name="url"
            id="url"
            required
            value={form.url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="https://example.com/video.mp4"
          />
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            Thumbnail URL *
          </label>
          <input
            type="url"
            name="thumbnail"
            id="thumbnail"
            required
            value={form.thumbnail}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>
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
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (seconds) *
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            required
            min={1}
            value={form.duration}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Enter duration in seconds"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Video'}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateVideo;
