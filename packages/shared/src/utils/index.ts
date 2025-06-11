import { MembershipTier, MEMBERSHIP_LIMITS, MembershipLimits } from '../types';

export const getMembershipLimits = (tier: MembershipTier): MembershipLimits => {
  return MEMBERSHIP_LIMITS[tier];
};

export const canAccessContent = (
  tier: MembershipTier,
  currentUsage: { articles: number; videos: number },
  contentType: 'article' | 'video'
): boolean => {
  const limits = getMembershipLimits(tier);
  
  if (contentType === 'article') {
    return limits.articles === -1 || currentUsage.articles < limits.articles;
  } else {
    return limits.videos === -1 || currentUsage.videos < limits.videos;
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
