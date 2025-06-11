import mongoose, { Schema, Document } from 'mongoose';
import { Video as IVideo } from '@astronacci/shared';

interface VideoDocument extends Omit<IVideo, '_id'>, Document {}

const videoSchema = new Schema<VideoDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: Date.now
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
videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ category: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ featured: 1 });
videoSchema.index({ publishedAt: -1 });

export const Video = mongoose.model<VideoDocument>('Video', videoSchema);
