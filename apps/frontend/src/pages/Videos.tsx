import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { videoService, Video } from '../services/videoService';
import Pagination from '../components/Pagination';

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [membershipLimit, setMembershipLimit] = useState<any>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await videoService.getVideos({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
      });
      setVideos(response.data);
      setTotalPages(response.pagination.pages);
      setMembershipLimit(response.membershipLimit || null);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediately update debounced search on form submit
    setDebouncedSearch(search);
    setPage(1);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Videos</h1>
        <p className="mt-2 text-sm text-gray-700">
          Discover our video content library
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search videos..."
            />
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Membership Limit Warning */}
      {!loading && membershipLimit && (
        <div className={`mb-6 p-4 rounded-lg ${
          membershipLimit.hasReachedLimit 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {membershipLimit.hasReachedLimit ? (
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                membershipLimit.hasReachedLimit ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {membershipLimit.hasReachedLimit ? 'Content Limit Reached' : 'Limited Access'}
              </h3>
              <div className={`mt-2 text-sm ${
                membershipLimit.hasReachedLimit ? 'text-red-700' : 'text-yellow-700'
              }`}>
                <p>{membershipLimit.message}</p>
                {!membershipLimit.hasReachedLimit && (
                  <div className="mt-2">
                    <div className={`w-full bg-gray-200 rounded-full h-2`}>
                      <div 
                        className={`h-2 rounded-full ${
                          membershipLimit.used >= membershipLimit.limit ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min((membershipLimit.used / membershipLimit.limit) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1">
                      {membershipLimit.used}/{membershipLimit.limit} videos accessed
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => window.location.href = '/profile'}
                  className={`text-sm font-medium ${
                    membershipLimit.hasReachedLimit 
                      ? 'text-red-700 hover:text-red-600' 
                      : 'text-yellow-700 hover:text-yellow-600'
                  } underline`}
                >
                  Upgrade Membership →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No results */}
      {!loading && videos.length === 0 && !membershipLimit?.hasReachedLimit && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search terms.' : 'No videos have been published yet.'}
          </p>
        </div>
      )}

      {/* Membership Limit Reached - Show Empty State */}
      {!loading && videos.length === 0 && membershipLimit?.hasReachedLimit && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Content Access Restricted</h3>
          <p className="mt-1 text-sm text-gray-500">
            You've reached your video limit. Upgrade your membership to access more content.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link
            key={video._id}
            to={`/videos/${video._id}`}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Video Thumbnail */}
            <div className="aspect-video bg-gray-100 relative">
              {video.thumbnail ? (
                <img
                  className="w-full h-full object-cover"
                  src={video.thumbnail}
                  alt={video.title}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white bg-opacity-90 rounded-full p-3">
                  <svg className="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2">
                {video.title}
              </h3>
              <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                {video.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{video.author?.name ?? 'Unknown Author'}</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {video.tags.slice(0, 2).map((tag) => (
                    <span
                      key={`${video._id}-${tag}`}
                      className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {video.tags.length > 2 && (
                    <span className="text-gray-500 text-xs">+{video.tags.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-8"
      />
    </div>
  );
};

export default Videos;
