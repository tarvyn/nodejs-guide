import { BuildOptions, DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/database';

export interface ProductModel extends Model {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}

export type ProductModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductModel;
}

export const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}) as ProductModelStatic;
