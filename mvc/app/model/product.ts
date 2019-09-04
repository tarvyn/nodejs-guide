import * as fs from 'fs';
import * as path from 'path';
import { rootPath } from '../util/path';
import { Cart } from './cart';

const targetPath = path.join(rootPath, 'data', 'products.json');
const getProductsFromFile: () => Promise<Array<Product>> =
  () => new Promise((resolve, reject) => {
    fs.readFile(targetPath, (err, fileContent) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(fileContent.toString()));
    });
  });


class Product {
  constructor(
    public id: string | undefined,
    public title: string,
    public imageUrl: string,
    public description: string,
    public price: number
  ) {
  }

  save(): void {
    getProductsFromFile()
      .then((products) => {
        if (this.id) {
          const existingProductIndex = products.findIndex(product => product.id === this.id);
          const updatedProducts = [...products];

          updatedProducts[existingProductIndex] = this;

          return Product.writeProductsFile(updatedProducts);
        } else {
          this.id = Math.random().toString();
          products.push(this);

          return Product.writeProductsFile(products);
        }
      })
  }

  static async deleteProduct(id: string): Promise<void> {
    const products = await this.fetchAll();
    const updatedProducts = products.filter(product => product.id !== id);

    await Product.writeProductsFile(updatedProducts);
    await Cart.deleteProduct(id);
  }

  static async fetchAll(): Promise<Array<Product>> {
    return await getProductsFromFile();
  }

  static async findById(id: string): Promise<Product> {
    const products = await Product.fetchAll();

    return products.find(product => product.id === id) as Product;
  }

  static async writeProductsFile(products: Array<Product>): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(targetPath, JSON.stringify(products), err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}

export { Product };
