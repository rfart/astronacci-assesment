import React from 'react';

interface Props {
  analytics: any;
  cmsStats: any;
}

const ContentAnalytics: React.FC<Props> = ({ analytics, cmsStats }) => {
  return (
    <>
      {/* Content Analytics */}
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
      {/* Recent Content & Top Categories */}
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
  );
};

export default ContentAnalytics;
