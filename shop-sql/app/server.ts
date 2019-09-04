import bodyParser = require('body-parser');
import express = require('express');
import * as path from 'path';
import { get404 } from './controllers/error';
import { Product } from './model/product';
import { User } from './model/user';
import { adminRoutes } from './routes/admin';
import { shopRoutes } from './routes/shop';
import { sequelize } from './util/database';

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => User
  .findByPk(1)
  .then(user => {
    (req as any).user = user;
    next();
  })
);
app.use('/admin', adminRoutes);

app.use(shopRoutes);
app.use(get404);

Product
  .belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User
  .hasMany(Product);

sequelize
  .sync({ force: true })
  .then(() => User.findByPk(1))
  .then(user => user || User.create({ name: 'Mad Max', email: 'fake@gmail.com' }))
  .then(() => app.listen(3000));
