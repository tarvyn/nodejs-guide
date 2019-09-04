import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  'node-complete',
  'root',
  'Иорн8ь3уй1111',
  {
    dialect: 'mysql',
    host: 'localhost'
  }
);



