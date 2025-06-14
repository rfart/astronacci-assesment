import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser, MembershipTier, UserRole } from '@astronacci/shared';

interface UserDocument extends Omit<IUser, '_id'>, Document {
  role: UserRole;
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
userSchema.index({ socialId: 1, socialProvider: 1 });
userSchema.index({ membershipTier: 1 });

// Instance methods
userSchema.methods.canAccessContent = function(contentType: 'article' | 'video'): boolean {
  const limits = {
    [MembershipTier.TYPE_A]: { articles: 3, videos: 3 },
    [MembershipTier.TYPE_B]: { articles: 10, videos: 10 },
    [MembershipTier.TYPE_C]: { articles: -1, videos: -1 } // unlimited
  };

  const limit = limits[this.membershipTier as MembershipTier];
  
  if (contentType === 'article') {
    return limit.articles === -1 || this.articlesRead < limit.articles;
  } else {
    return limit.videos === -1 || this.videosWatched < limit.videos;
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

export const User = mongoose.model<UserDocument>('User', userSchema);
