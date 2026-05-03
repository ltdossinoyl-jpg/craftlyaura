import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  slug?: string;
  images?: string[];
  tags?: string[];
  variants?: Array<{
    size: string;
    color?: string;
    price?: number;
    sku?: string;
  }>;
  inventory?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  category: { type: String, default: '' },
  image: { type: String, default: '' },
  slug: { type: String, index: true },
  images: [{ type: String }],
  tags: [{ type: String }],
  variants: [{
    size: String,
    color: String,
    price: Number,
    sku: String,
  }],
  inventory: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      const { _id, __v, ...rest } = ret;
      return rest;
    }
  }
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
