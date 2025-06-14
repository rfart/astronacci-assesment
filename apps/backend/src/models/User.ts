import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { MembershipTier, UserRole } from '@astronacci/shared';

interface UserDocument extends Document {
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  membershipTier: MembershipTier;
  role: UserRole;
  socialProvider: 'google' | 'facebook' | 'local';
  socialId?: string;
  articlesRead: number;
  videosWatched: number;
  dailyArticlesAccessed: number;
  dailyVideosAccessed: number;
  lastAccessDate: Date;
  accessedContentToday: {
    articles: Array<{
      contentId: string;
      accessDate: Date;
    }>;
    videos: Array<{
      contentId: string;
      accessDate: Date;
    }>;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  canAccessContent(contentType: 'article' | 'video'): boolean;
  incrementUsage(contentType: 'article' | 'video'): Promise<void>;
  checkAndResetDailyLimit(): void;
  canAccessContentDetail(contentType: 'article' | 'video', contentId: string): { canAccess: boolean, reason?: string };
  recordContentAccess(contentType: 'article' | 'video', contentId: string): Promise<void>;
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: function(this: UserDocument) {
      return this.socialProvider === 'local';
    },
    minlength: 6
  },
  avatar: {
    type: String,
    default: null
  },
  membershipTier: {
    type: String,
    enum: Object.values(MembershipTier),
    default: MembershipTier.TYPE_A,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
    required: true
  },
  socialProvider: {
    type: String,
    enum: ['google', 'facebook', 'local'],
    required: true
  },
  socialId: {
    type: String,
    sparse: true // Allows multiple null values but ensures uniqueness for non-null values
  },
  articlesRead: {
    type: Number,
    default: 0,
    min: 0
  },
  videosWatched: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyArticlesAccessed: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyVideosAccessed: {
    type: Number,
    default: 0,
    min: 0
  },
  lastAccessDate: {
    type: Date,
    default: Date.now
  },
  accessedContentToday: {
    articles: [{
      contentId: { type: String },
      accessDate: { type: Date }
    }],
    videos: [{
      contentId: { type: String },
      accessDate: { type: Date }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ socialId: 1, socialProvider: 1 }, { sparse: true });
userSchema.index({ membershipTier: 1 });

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};
userSchema.methods.canAccessContent = function(contentType: 'article' | 'video'): boolean {
  const limits = {
    [MembershipTier.TYPE_A]: { articles: 3, videos: 3 },
    [MembershipTier.TYPE_B]: { articles: 10, videos: 10 },
    [MembershipTier.TYPE_C]: { articles: -1, videos: -1 } // unlimited
  };

  const limit = limits[this.membershipTier as MembershipTier];
  
  if (contentType === 'article') {
    return limit.articles === -1 || this.dailyArticlesAccessed < limit.articles;
  } else {
    return limit.videos === -1 || this.dailyVideosAccessed < limit.videos;
  }
};

userSchema.methods.incrementUsage = async function(contentType: 'article' | 'video'): Promise<void> {
  if (contentType === 'article') {
    this.articlesRead += 1;
  } else {
    this.videosWatched += 1;
  }
  await this.save();
};

userSchema.methods.checkAndResetDailyLimit = function(): void {
  const today = new Date();
  const lastAccess = new Date(this.lastAccessDate);
  
  // If it's a new day, update lastAccessDate (this triggers the reset logic)
  if (today.toDateString() !== lastAccess.toDateString()) {
    this.lastAccessDate = today;
  }
};

userSchema.methods.getTodayAccess = function(contentType: 'article' | 'video'): number {
  const today = new Date();
  const todayStr = today.toDateString();
  const lastAccessStr = new Date(this.lastAccessDate).toDateString();
  
  // If last access was not today, return 0 (fresh start)
  if (todayStr !== lastAccessStr) {
    return 0;
  }
  
  // Count content accessed today
  const accessList = contentType === 'article' 
    ? this.accessedContentToday.articles 
    : this.accessedContentToday.videos;
  
  return accessList.filter((access: any) => {
    const accessDate = new Date(access.accessDate);
    return accessDate.toDateString() === todayStr;
  }).length;
};

userSchema.methods.hasAccessedToday = function(contentType: 'article' | 'video', contentId: string): boolean {
  const today = new Date();
  const todayStr = today.toDateString();
  const lastAccessStr = new Date(this.lastAccessDate).toDateString();
  
  // If last access was not today, user hasn't accessed anything today
  if (todayStr !== lastAccessStr) {
    return false;
  }
  
  const accessList = contentType === 'article' 
    ? this.accessedContentToday.articles 
    : this.accessedContentToday.videos;
  
  return accessList.some((access: any) => {
    const accessDate = new Date(access.accessDate);
    return access.contentId === contentId && accessDate.toDateString() === todayStr;
  });
};

userSchema.methods.canAccessContentDetail = function(contentType: 'article' | 'video', contentId: string): { canAccess: boolean, reason?: string } {
  const limits = {
    [MembershipTier.TYPE_A]: { articles: 3, videos: 3 },
    [MembershipTier.TYPE_B]: { articles: 10, videos: 10 },
    [MembershipTier.TYPE_C]: { articles: -1, videos: -1 } // unlimited
  };

  const limit = limits[this.membershipTier as MembershipTier];
  
  // Check if user has already accessed this content today (free re-access)
  if (this.hasAccessedToday(contentType, contentId)) {
    return { canAccess: true };
  }
  
  // Get today's usage count
  const todayUsage = this.getTodayAccess(contentType);
  
  // Check daily limit
  if (contentType === 'article') {
    if (limit.articles === -1) {
      return { canAccess: true };
    }
    if (todayUsage >= limit.articles) {
      return { 
        canAccess: false, 
        reason: `Daily article limit reached (${todayUsage}/${limit.articles}). Try again tomorrow or upgrade your membership.`
      };
    }
  } else {
    if (limit.videos === -1) {
      return { canAccess: true };
    }
    if (todayUsage >= limit.videos) {
      return { 
        canAccess: false, 
        reason: `Daily video limit reached (${todayUsage}/${limit.videos}). Try again tomorrow or upgrade your membership.`
      };
    }
  }
  
  return { canAccess: true };
};

userSchema.methods.recordContentAccess = async function(contentType: 'article' | 'video', contentId: string): Promise<void> {
  // Check if already accessed today
  if (this.hasAccessedToday(contentType, contentId)) {
    return; // Don't record duplicate access for the same day
  }
  
  const now = new Date();
  
  // Add to accessed content list with timestamp
  if (contentType === 'article') {
    this.accessedContentToday.articles.push({
      contentId: contentId,
      accessDate: now
    });
    this.articlesRead += 1; // Keep total count for backward compatibility
  } else {
    this.accessedContentToday.videos.push({
      contentId: contentId,
      accessDate: now
    });
    this.videosWatched += 1; // Keep total count for backward compatibility
  }
  
  // Update last access date
  this.lastAccessDate = now;
  
  await this.save();
};

export const User = mongoose.model<UserDocument>('User', userSchema);
