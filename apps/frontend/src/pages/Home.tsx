import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to our Social Media Platform
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Discover amazing content, connect with others, and share your thoughts. 
          Choose from different membership tiers to access premium content.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/articles"
            className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Browse Articles
          </Link>
          <Link
            to="/videos"
            className="text-sm font-semibold leading-6 text-gray-900 border border-gray-300 rounded-md px-3.5 py-2.5 hover:bg-gray-50"
          >
            Watch Videos
          </Link>
        </div>
      </div>

      {/* Membership Tiers */}
      <div className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Choose Your Membership
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the plan that best fits your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Type A */}
          <div className="bg-white rounded-lg shadow-lg p-6 border">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Type A - Basic</h3>
            <p className="text-gray-600 mb-4">Perfect for casual readers</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                3 Articles per month
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                3 Videos per month
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Basic content access
              </li>
            </ul>
            <div className="text-2xl font-bold text-gray-900 mb-4">Free</div>
          </div>

          {/* Type B */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-primary-500">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-gray-900">Type B - Premium</h3>
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Popular
              </span>
            </div>
            <p className="text-gray-600 mb-4">Great for regular users</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                10 Articles per month
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                10 Videos per month
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Premium content access
              </li>
            </ul>
            <div className="text-2xl font-bold text-gray-900 mb-4">$9.99/month</div>
          </div>

          {/* Type C */}
          <div className="bg-white rounded-lg shadow-lg p-6 border">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Type C - Ultimate</h3>
            <p className="text-gray-600 mb-4">For power users</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited Articles
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited Videos
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                All premium features
              </li>
            </ul>
            <div className="text-2xl font-bold text-gray-900 mb-4">$19.99/month</div>
          </div>
        </div>
      </div>

      {/* Current User Status */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Your Current Membership
          </h3>
          <p className="text-blue-700">
            You are currently on the <strong>{user.membershipType}</strong> plan.
          </p>
          <Link
            to="/profile"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Manage Membership
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
