import { RequestHandler } from 'express';

export const localsMiddleware: RequestHandler = (req, res, next) => {
  const { session, csrfToken } = req;

  if (!csrfToken) {
    return;
  }

  res.locals.isAuthenticated = session && session.isLoggedIn;
  res.locals.csrfToken = csrfToken();
  next();
};