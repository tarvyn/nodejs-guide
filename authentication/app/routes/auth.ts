import express = require('express');
import {
  getLogin, getNewPassword,
  getResetPassword,
  getSignUp,
  postLogin,
  postLogout, postNewPassword,
  postResetPassword,
  postSignUp
} from '../controllers/auth';

export const authRoutes = express.Router();

authRoutes.get('/login', getLogin);

authRoutes.get('/signup', getSignUp);

authRoutes.get('/reset-password', getResetPassword);

authRoutes.get('/reset/:token', getNewPassword);

authRoutes.post('/login', postLogin);

authRoutes.post('/logout', postLogout);

authRoutes.post('/signup', postSignUp);

authRoutes.post('/reset-password', postResetPassword);

authRoutes.post('/new-password', postNewPassword);

