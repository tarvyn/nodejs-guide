import bodyParser from 'body-parser';
import express from 'express';
import mime from 'mime';
import multer, { Options, StorageEngine } from 'multer';
import * as path from "path";
import uuid from 'uuidv4';
import { authRoutes } from './routes/auth';
import { feedRoutes } from './routes/feed';
import { mongoConnect } from './utils/database';
import socket, { Server } from 'socket.io';

export let io: Server;

(async () => {
  const app = express();
  const storage: StorageEngine = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'app/images');
    },
    filename(req, file, callback): void {
      callback(null, `${uuid()}.${mime.getExtension(file.mimetype)}`);
    }
  });
  const fileFilter: Options['fileFilter'] = (req, file, callback) =>
    callback(null, /^image\/(jpg|jpeg|png)$/.test(file.mimetype));

  app.use(bodyParser.json());
  app.use(multer({ storage, fileFilter }).single('image'));
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  app.use('/app/images', express.static(path.join(__dirname, 'images')));
  app.use('/feed', feedRoutes);
  app.use('/auth', authRoutes);
  app.use((err, req, res, next) => res.status(500).json({ message: err.message }));
  await mongoConnect();

  const server = app.listen(8080);
  io = socket(server);

  io.on('connection', socket => {
    console.log('client connected');
  });
})();
