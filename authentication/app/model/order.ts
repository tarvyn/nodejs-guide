import { CartProductInfo, User, userSchemaConfig } from './user.model';
import { Document, model, Schema, SchemaTypes } from "mongoose";
import { Schemas } from './schemas';

export interface OrderInfo {
  items: Array<CartProductInfo>;
  userId: User;
}

export type Order = OrderInfo & Document;

const OrderSchema = new Schema({
  items: userSchemaConfig.cart.products,
  userId: {
    type: SchemaTypes.ObjectId,
    ref: Schemas.User
  }
});

export const OrderModel = model<Order>(Schemas.Order, OrderSchema);