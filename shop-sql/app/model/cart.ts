import * as fs from "fs";
import * as path from "path";
import { rootPath } from '../util/path';
import { ProductModel } from './product';

type ProductInfo = Pick<ProductModel, 'id' | 'price'> & { quantity: number };

interface CartInfo {
  products: Array<ProductInfo>;
  totalPrice: number;
}

const targetPath = path.join(rootPath, 'data', 'cart.json');
const getCartFromFile: () => Promise<CartInfo> =
  () => new Promise((resolve, reject) => {
    fs.readFile(targetPath, (err, fileContent) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(fileContent.toString()));
    });
  });

const writeCartToFile: (cart: CartInfo) => Promise<void> = cart => {
  return new Promise((resolve, reject) => {
    fs.writeFile(targetPath, JSON.stringify(cart), err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

export class Cart {
  static async addProduct(id: string, price: number): Promise<void> {
    const cart = await getCartFromFile();
    const existingProductIndex = cart.products.findIndex(product => product.id === id);
    const existingProduct = cart.products[existingProductIndex];

    if (existingProduct) {
      cart.products[existingProductIndex] = {
        ...existingProduct,
        quantity: existingProduct.quantity + 1
      };
    } else {
      cart.products = [
        ...cart.products,
        { id, price, quantity: 1 }
      ];
    }
    cart.totalPrice += price;
    return await writeCartToFile(cart);
  }

  static async deleteProduct(id: string): Promise<void> {
    const cart = await getCartFromFile();
    const updatedCart = { ...cart };
    const product = updatedCart.products.find(product => product.id === id) as ProductInfo;

    if (!product) {
      return;
    }

    updatedCart.products = updatedCart.products.filter(product => product.id !== id);
    updatedCart.totalPrice -= product.quantity * product.price;

    return await writeCartToFile(updatedCart);
  }

  static async getCart(): Promise<CartInfo> {
    return await getCartFromFile();
  }
}
