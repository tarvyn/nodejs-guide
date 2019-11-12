import bodyParser from 'body-parser';
import express from 'express';
import graphqlHttp from 'express-graphql';
import mime from 'mime';
import multer, { Options, StorageEngine } from 'multer';
import * as path from "path";
import 'reflect-metadata';
import uuid from 'uuidv4';
import { initSchema } from './graphql/schema';
import { auth } from './middlewares/auth';
import { catchPromiseError } from './utils/catch-promise-error';
import { mongoConnect } from './utils/database';
import { deleteImage } from './utils/delete-image';

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

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  app.use('/app/images', express.static(path.join(__dirname, 'images')));

  const [generateSchemaError, schema] = await catchPromiseError(initSchema);

  if (generateSchemaError) {
    console.log(generateSchemaError);
    throw generateSchemaError;
  }

  app.use(auth);
  app.use('/post-image', async (req, res, next) => {
    const { file, body: { oldPath }, isAuthenticated } = req;

    if (!isAuthenticated) {
      return next(new Error('User is not authenticated'));
    }

    if (!file) {
      return res.status(200).json({ message: 'No file was provided' });
    }

    if (oldPath) {
      const [deleteImageError] = await catchPromiseError(deleteImage(oldPath));

      if (deleteImageError) {
        return next(deleteImageError);
      }
    }

    return res
      .status(201)
      .json({
        message: 'File successfully uploaded',
        filePath: req.file.path.replace(/\\/g, '/')
      });
  });

  app.use('/graphql', graphqlHttp({
    schema,
    graphiql: true,
    customFormatErrorFn: error => ({ ...error, ...(error.originalError || {}) })
  }));

  app.use((err, req, res, next) => res.status(500).json({ message: err.message }));
  await mongoConnect();

  app.listen(8080);
})();
