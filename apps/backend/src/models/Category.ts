import mongoose, { Schema, Document } from 'mongoose';
import { Category as ICategory } from '@astronacci/shared';

interface CategoryDocument extends Omit<ICategory, '_id'>, Document {}

const categorySchema = new Schema<CategoryDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
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
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema);
