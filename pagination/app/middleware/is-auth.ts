import { RequestHandler } from 'express';

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const { session } = req;

  if (!session || !session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};