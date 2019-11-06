import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthTokenPayload, secretKey } from '../controllers/auth';

export const isAuth: RequestHandler = async (req, res, next) => {
  const authorizationHeader = req.get('Authorization');
  const token = authorizationHeader && authorizationHeader.split(' ')[1];
  let decodedToken: AuthTokenPayload;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated'});
  }

  try {
    decodedToken = verify(token, secretKey) as AuthTokenPayload;
  } catch (e) {
    return next(e);
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated'});
  }

  req.userId = decodedToken.userId;
  next();
};
