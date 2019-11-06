import { Document, model, Schema, SchemaTypes, Types } from 'mongoose';
import { Post } from './post.model';
import { Schemas } from './schemas';

export interface User extends Document {
  _id: Types.ObjectId
  email: string;
  name: string;
  password: string;
  status: string;
  posts: Array<Post>;
}

export const userSchemaConfig = {
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Object,
    required: false
  },
  posts: [{
    type: SchemaTypes.ObjectId,
    ref: Schemas.Post
  }]
};

const UserSchema = new Schema(userSchemaConfig);

export const UserModel = model<User & Document>(Schemas.User, UserSchema);
