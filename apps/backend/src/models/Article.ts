import mongoose, { Schema, Document } from 'mongoose';
import { Article as IArticle } from '@astronacci/shared';

interface ArticleDocument extends Omit<IArticle, '_id'>, Document {}

const articleSchema = new Schema<ArticleDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  author: {
    type: String,
    required: true,
    trim: true
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
articleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
articleSchema.index({ category: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ featured: 1 });
articleSchema.index({ publishedAt: -1 });

export const Article = mongoose.model<ArticleDocument>('Article', articleSchema);
