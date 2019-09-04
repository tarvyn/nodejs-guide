import { BuildOptions, DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/database';

export interface UserModel extends Model {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export type UserModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserModel;
}

export const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING
}) as UserModelStatic;
