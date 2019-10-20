import { Product, ProductModel } from './product.model';
import { Document, Model, model, Schema, SchemaTypes, Types } from 'mongoose';
import { Schemas } from './schemas';

export interface CartProductInfo {
  productId: Product;
  quantity: number;
}

export interface CartInfo {
  products: Array<CartProductInfo>;
  totalPrice: number;
}

export interface UserInfo {
  _id: Types.ObjectId
  name: string;
  email: string;
  cart: CartInfo;
}

export interface User extends UserInfo, Model<UserInfo & Document> {
  addProductToCart(this: User, productId: string): Promise<void>;

  removeProductFromCart(this: User, productId: string): Promise<void>;

  emptyCart(this: User): Promise<void>;
}

async function addProductToCart(this: User, productId: string): Promise<void> {
  const product = await ProductModel.findById(productId);

  if (!product) {
    return;
  }

  const cartProductIndex = this.cart.products
    .findIndex(({ productId: { _id } }) => _id.toString() === productId.toString());
  const newProducts = [...this.cart.products];

  if (cartProductIndex >= 0) {
    const cartProductToUpdate = newProducts[cartProductIndex];

    newProducts[cartProductIndex] = {
      productId: product._id,
      quantity: cartProductToUpdate.quantity + 1
    }
  } else {
    newProducts.push({
      productId: product._id,
      quantity: 1
    });
  }

  this.cart = {
    products: newProducts,
    totalPrice: this.cart.totalPrice + product.price
  };

  await this.save();
}

async function removeProductFromCart(this: User, productId: string): Promise<void> {
  const product = await ProductModel.findById(productId);

  if (!product) {
    return;
  }

  const cartProductIndex = this.cart.products
    .findIndex(({ productId: { _id } }) => _id.toString() === productId.toString());
  const cartProduct = this.cart.products[cartProductIndex];
  const newProducts = [...this.cart.products];

  if (cartProductIndex >= 0) {
    newProducts.splice(cartProductIndex, 1);
  }

  this.cart = {
    products: newProducts,
    totalPrice: this.cart.totalPrice -
      (product.price * cartProduct.quantity)
  };

  await this.save();
}

async function emptyCart(this: User): Promise<void> {
  this.cart = defaultEmptyCart;
  await this.save();
}

const defaultEmptyCart = { products: [], totalPrice: 0 };

export const defaultUserInfo = {
  name: 'test',
  email: 'test@gmail.com',
  cart: defaultEmptyCart
};

export const userSchemaConfig = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    products: [
      {
        productId: {
          type: SchemaTypes.ObjectId,
          ref: Schemas.Product,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    }
  }
};

const UserSchema = new Schema(userSchemaConfig);

UserSchema.methods.addProductToCart = addProductToCart;
UserSchema.methods.removeProductFromCart = removeProductFromCart;
UserSchema.methods.emptyCart = emptyCart;

export const UserModel = model<UserInfo & Document>(Schemas.User, UserSchema) as User;
