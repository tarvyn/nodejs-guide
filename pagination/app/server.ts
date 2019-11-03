import bodyParser = require('body-parser');
import express from 'express';
import * as path from 'path';
import { get404, get500 } from './controllers/error';
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
import multer, { Options, StorageEngine } from 'multer';
import { localsMiddleware } from './middleware/locals';

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
  const storage: StorageEngine = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'app/images');
    },
    filename(req, file, callback): void {
      callback(null, `${new Date().valueOf()}-${file.originalname}`);
    }
  });
  const fileFilter: Options['fileFilter'] = (req, file, callback) =>
    callback(null, /^image\/(jpg|jpeg|png)$/.test(file.mimetype));

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(multer({ storage, fileFilter }).single('image'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use(session({
    store,
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));
  app.use(flashMiddleware);
  app.use(csrfMiddleware);
  app.use(localsMiddleware);

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
  app.use('/500', get500);
  app.use(get404);

  app.use((err, req, res, next) => {
    res.status(500).render('500', {
      pageTitle: 'Error',
      path: '/',
      message: err.message,
      isAuthenticated: req.session && req.session.isLoggedIn
    });
  });
  await mongoConnect();

  app.listen(3000);
};

startServer();