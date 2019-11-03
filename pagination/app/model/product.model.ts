import { Document, model, Schema, SchemaTypes } from 'mongoose';
import { Schemas } from './schemas';

export interface ProductInfo {
  id?: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  image: any;
  userId: string;
}

export type Product = Omit<ProductInfo, 'id'> & Document;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: Schemas.User
  }
});

export const ProductModel = model<Product>(Schemas.Product, ProductSchema);

