import { getDb } from '../util/database';
import { DeleteWriteOpResultObject, InsertOneWriteOpResult, ObjectId, UpdateWriteOpResult } from 'mongodb';
import { BaseEntity } from './base-entity';

export interface ProductInfo {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
}

export type Product = ProductInfo & BaseEntity;

const getCollection = () => getDb().collection<Product>('product');

export class ProductModel  {
  constructor(
    public readonly title: string,
    public readonly price: number,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly id?: string,
    public readonly userId?: string
  ) {}

  save(): Promise<InsertOneWriteOpResult<Product> | UpdateWriteOpResult> {
    if (this.id) {
      return getCollection().updateOne(
        { _id: new ObjectId(this.id) },
        { $set: this.getProduct() }
      );
    }

    return getCollection().insertOne(this.getProduct());
  }

  static fetchAll(): Promise<Array<Product>> {
    return getCollection().find().toArray();
  }

  static findById(id: string): Promise<Product | null> {
    return getCollection().find({ _id: new ObjectId(id) }).next();
  }

  static deleteById(id: string): Promise<DeleteWriteOpResultObject> {
    return getCollection().deleteOne({ _id: new ObjectId(id) });
  }

  private getProduct(): ProductInfo {
    const { title, description, imageUrl, price, userId } = this;

    return {
      title,
      description,
      imageUrl,
      price,
      ...(userId ? { userId: new ObjectId(userId) } : {})
    };
  }
}