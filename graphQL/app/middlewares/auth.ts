import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthTokenPayload, secretKey } from '../controllers/auth';
import { catchPromiseError } from '../utils/catch-promise-error';

export const auth: RequestHandler = async (req, res, next) => {
  const authorizationHeader = req.get('Authorization');
  const token = authorizationHeader && authorizationHeader.split(' ')[1];

  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  const [error, decodedToken] = await catchPromiseError(
    (async () => verify(token, secretKey) as AuthTokenPayload)()
  );

  if (error || !decodedToken) {
    req.isAuthenticated = false;
    return next();
  }

  req.isAuthenticated = true;
  req.userId = decodedToken.userId;
  next();
};
