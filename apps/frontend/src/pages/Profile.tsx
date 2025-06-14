import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Format membership tier for display
  const getMembershipDisplayName = (tier: string) => {
    switch (tier) {
      case 'TYPE_A':
        return 'Basic (3 articles, 3 videos)';
      case 'TYPE_B':
        return 'Standard (10 articles, 10 videos)';
      case 'TYPE_C':
        return 'Premium (Unlimited)';
      default:
        return tier;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Membership Type</label>
              <p className="mt-1 text-sm text-gray-900">{getMembershipDisplayName(user.membershipTier)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
