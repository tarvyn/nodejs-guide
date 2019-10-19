import { getDb } from '../util/database';
import { InsertOneWriteOpResult, ObjectId, UpdateWriteOpResult } from 'mongodb';
import { BaseEntity } from './base-entity';
import { Product, ProductModel } from './product.model';

export interface Order {
  items: Record<string, ProductInfo>;
  user: Pick<User, '_id' | 'name'>;
}

export interface ProductInfo {
  product: Product;
  quantity: number;
}

export interface CartInfo {
  products: Record<string, ProductInfo>;
  totalPrice: number;
}

export interface UserInfo {
  name: string;
  email: number;
  cart: CartInfo;
}

export type User = UserInfo & BaseEntity;

const getCollection = () => getDb().collection<User>('user');
const getOrderCollection = () => getDb().collection<Order>('order');
const emptyCart = { products: {}, totalPrice: 0 };

export class UserModel {
  constructor(
    public readonly name: string,
    public readonly email: number,
    public id?: string,
    public cart: CartInfo = emptyCart
  ) {}

  save(): Promise<InsertOneWriteOpResult<UserInfo> | UpdateWriteOpResult> {
    if (this.id) {
      return getCollection().updateOne(
        { _id: new ObjectId(this.id) },
        { $set: this.getUser() }
      );
    }

    return getCollection().insertOne(this.getUser());
  }

  async addProductToCart(productId: string): Promise<void> {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return;
    }

    const cartProduct = this.cart.products[productId];

    this.cart = {
      products: {
        ...this.cart.products,
        [productId]: {
          product: cartProduct ? cartProduct.product : product,
          quantity: (cartProduct ? cartProduct.quantity : 0) + 1
        }
      },
      totalPrice: this.cart.totalPrice + product.price
    };

    await this.save();
  }

  async removeProductFromCart(productId: string): Promise<void> {
    const product = await ProductModel.findById(productId);
    const cartProduct = this.cart.products[productId];

    if (!product || !cartProduct) {
      return;
    }

    const { products: { [productId]: productToDelete, ...remainingProducts } } =
      this.cart;
    const { product: { price }, quantity } = productToDelete;

    this.cart = {
      products: { ...remainingProducts },
      totalPrice: this.cart.totalPrice - (price * quantity)
    };

    await this.save();
  }

  async emptyCart(): Promise<void> {
    this.cart = emptyCart;
    await this.save();
  }

  async addOrder(): Promise<void> {
    await getOrderCollection().insertOne({
      items: this.cart.products,
      user: {
        _id: new ObjectId(this.id),
        name: this.name
      }
    });
    await this.emptyCart();
  }

  async getOrders(): Promise<Array<Order>> {
    return await getOrderCollection().find().toArray();
  }

  static findById(id: string): Promise<User | null> {
    return getCollection().find({ _id: new ObjectId(id) }).next();
  }

  private getUser(): UserInfo {
    const { name, email, cart } = this;

    return { name, email, cart };
  }
}