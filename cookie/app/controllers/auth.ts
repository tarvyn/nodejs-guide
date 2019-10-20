import { RequestHandler } from 'express';
import { defaultUserInfo, User, UserModel } from '../model/user.model';

export const getLogin: RequestHandler = async (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};

export const postLogin: RequestHandler = async (req, res) => {
  const {session} = req;

  if (session) {
    const user = await UserModel.findOne()
      || await new UserModel(defaultUserInfo).save();

    session.isLoggedIn = true;
    session.user = user;
    await session.save();
  }
  res.redirect('/');
};

export const postLogout: RequestHandler = async (req, res) => {
  const {session} = req;

  if (session) {
    return session.destroy(() => {
      req.user = undefined;
      res.redirect('/');
    });
  }
  res.redirect('/');
};