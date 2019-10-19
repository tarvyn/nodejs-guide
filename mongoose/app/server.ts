import bodyParser = require('body-parser');
import express = require('express');
import * as path from 'path';
import { get404 } from './controllers/error';
import { adminRoutes } from './routes/admin';
import { shopRoutes } from './routes/shop';
import { mongoConnect } from './util/database';
import { RequestWithUser } from './model/request';
import { defaultUserInfo, UserModel } from './model/user.model';

const startServer = async () => {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(async (req: RequestWithUser, res, next) => {
    let user = await UserModel.findOne();

    if (!user) {
      user = await new UserModel(defaultUserInfo).save();
    }

    req.user = user;
    next();
  });
  app.use('/admin', adminRoutes);
  app.use(shopRoutes);

  app.use(get404);

  await mongoConnect();

  app.listen(3000);
};

startServer();