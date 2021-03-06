import { Document, model, Schema, SchemaTypes, Types } from 'mongoose';
import { Schemas } from './schemas';

export interface PostInfo {
  title: string;
  imageUrl: string;
  content: string;
  creator: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export interface Post extends PostInfo, Document {
  _id: Types.ObjectId;
}

export const postSchemaConfig = {
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creator: {
    type: SchemaTypes.ObjectId,
    ref: Schemas.User,
    required: true
  }
};

const PostSchema = new Schema(postSchemaConfig, { timestamps: true });

export const PostModel = model<Post & Document>(Schemas.Post, PostSchema);
