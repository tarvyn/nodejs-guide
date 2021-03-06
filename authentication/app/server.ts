import bodyParser = require('body-parser');
import express from 'express';
import * as path from 'path';
import { get404 } from './controllers/error';
import { adminRoutes } from './routes/admin';
import { shopRoutes } from './routes/shop';
import { connectionUrl, mongoConnect } from './util/database';
import { authRoutes } from './routes/auth';
import session from 'express-session';
import csrf from 'csurf';
import flash from 'connect-flash';
import connectSession from 'connect-mongodb-session'
import { User, UserModel } from './model/user.model';
import { createTransport } from 'nodemailer';
import sendGridTransport from 'nodemailer-sendgrid-transport';

export const transporter = createTransport(sendGridTransport({
  auth: {
    api_key: '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'
  }
}));

const SessionStore = connectSession(session);
const startServer = async () => {
  const store = new SessionStore({
    uri: connectionUrl,
    collection: 'sessions'
  });
  const app = express();
  const csrfMiddleware = csrf();
  const flashMiddleware = flash();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({
    store,
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));
  app.use(flashMiddleware);
  app.use(csrfMiddleware);
  app.use((req, res, next) => {
    const { session, csrfToken } = req;

    if (!session || !csrfToken) {
      return;
    }

    res.locals.isAuthenticated = session.isLoggedIn;
    res.locals.csrfToken = csrfToken();
    next();
  });

  app.use(async (req, res, next) => {
    const { session } = req;

    if (session && session.user && !req.user) {
      req.user = await UserModel.findById(session.user._id) as unknown as User;
    }
    next();
  });

  app.use(authRoutes);
  app.use('/admin', adminRoutes);
  app.use(shopRoutes);
  app.use(get404);

  await mongoConnect();

  app.listen(3000);
};

startServer();