import { Schema, model, Document } from 'mongoose';

export interface IPainting extends Document {
  title: string;
  description: string;
  price: number;
  image: string; // Cloudinary URL
  imagePublicId: string; // For deletion from Cloudinary
  category: string;
  artist: string;
  dimensions?: string;
  medium?: string;
  stock: number;
  featured: boolean;
  createdAt: Date;
}

const paintingSchema = new Schema<IPainting>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Abstract', 'Landscape', 'Portrait', 'Still Life', 'Modern', 'Watercolor', 'Oil', 'Digital', 'Other'],
    },
    artist: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
    },
    dimensions: {
      type: String,
      trim: true,
    },
    medium: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: [0, 'Stock cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Text index for search
paintingSchema.index({ title: 'text', description: 'text', artist: 'text' });

export default model<IPainting>('Painting', paintingSchema);
