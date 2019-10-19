import { ObjectId } from 'bson';

export interface BaseEntity {
  _id: ObjectId;
}