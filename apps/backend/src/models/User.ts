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
    articles: string[];
    videos: string[];
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
      type: String
    }],
    videos: [{
      type: String
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
  const now = new Date();
  const lastAccess = new Date(this.lastAccessDate);
  
  // Check if it's a new day (reset at midnight)
  const isNewDay = now.toDateString() !== lastAccess.toDateString();
  
  if (isNewDay) {
    this.dailyArticlesAccessed = 0;
    this.dailyVideosAccessed = 0;
    this.accessedContentToday = { articles: [], videos: [] };
    this.lastAccessDate = now;
  }
};

userSchema.methods.canAccessContentDetail = function(contentType: 'article' | 'video', contentId: string): { canAccess: boolean, reason?: string } {
  // Reset daily limits if it's a new day
  this.checkAndResetDailyLimit();
  
  const limits = {
    [MembershipTier.TYPE_A]: { articles: 3, videos: 3 },
    [MembershipTier.TYPE_B]: { articles: 10, videos: 10 },
    [MembershipTier.TYPE_C]: { articles: -1, videos: -1 } // unlimited
  };

  const limit = limits[this.membershipTier as MembershipTier];
  
  // Check if user has already accessed this content today (free re-access)
  const accessedToday = contentType === 'article' 
    ? this.accessedContentToday.articles.includes(contentId)
    : this.accessedContentToday.videos.includes(contentId);
  
  if (accessedToday) {
    return { canAccess: true };
  }
  
  // Check daily limit
  if (contentType === 'article') {
    if (limit.articles === -1) {
      return { canAccess: true };
    }
    if (this.dailyArticlesAccessed >= limit.articles) {
      return { 
        canAccess: false, 
        reason: `Daily article limit reached (${limit.articles}/${limit.articles}). Try again tomorrow or upgrade your membership.`
      };
    }
  } else {
    if (limit.videos === -1) {
      return { canAccess: true };
    }
    if (this.dailyVideosAccessed >= limit.videos) {
      return { 
        canAccess: false, 
        reason: `Daily video limit reached (${limit.videos}/${limit.videos}). Try again tomorrow or upgrade your membership.`
      };
    }
  }
  
  return { canAccess: true };
};

userSchema.methods.recordContentAccess = async function(contentType: 'article' | 'video', contentId: string): Promise<void> {
  // Reset daily limits if it's a new day
  this.checkAndResetDailyLimit();
  
  // Check if already accessed today
  const accessedToday = contentType === 'article' 
    ? this.accessedContentToday.articles.includes(contentId)
    : this.accessedContentToday.videos.includes(contentId);
  
  if (!accessedToday) {
    // Add to accessed content list
    if (contentType === 'article') {
      this.accessedContentToday.articles.push(contentId);
      this.dailyArticlesAccessed += 1;
      this.articlesRead += 1; // Keep total count for backward compatibility
    } else {
      this.accessedContentToday.videos.push(contentId);
      this.dailyVideosAccessed += 1;
      this.videosWatched += 1; // Keep total count for backward compatibility
    }
    
    await this.save();
  }
};

export const User = mongoose.model<UserDocument>('User', userSchema);
