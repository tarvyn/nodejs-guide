import { RequestHandler } from 'express';

export const get404: RequestHandler = (req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/'
  });
};

export const get500: RequestHandler = (req, res) => {
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/'
  });
};


