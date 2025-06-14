import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as IUser, MembershipTier, UserRole } from '@astronacci/shared';

interface UserDocument extends Omit<IUser, '_id'>, Document {
  role: UserRole;
  password?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
