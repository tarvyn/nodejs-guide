import bodyParser = require('body-parser');
import express = require('express');
import * as path from 'path';
import { get404 } from './controllers/error';
import { adminRoutes } from './routes/admin';
import { shopRoutes } from './routes/shop';
import { mongoConnect } from './util/database';
import { User, UserModel } from './model/user.model';
import { RequestWithUser } from './model/request-with-user';

const startServer = async () => {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(async (req: RequestWithUser, res, next) => {
    const { name, email, _id, cart } = await UserModel.findById('5da25aa79c3dd608507e4f53') as User;

    req.user = new UserModel(name, email, _id.toHexString(), cart);
    next();
  });
  app.use('/admin', adminRoutes);
  app.use(shopRoutes);

  app.use(get404);

  await mongoConnect();

  app.listen(3000);
};

startServer();