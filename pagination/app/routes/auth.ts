import express = require('express');
import {
  getLogin,
  getNewPassword,
  getResetPassword,
  getSignUp,
  postLogin,
  postLogout,
  postNewPassword,
  postResetPassword,
  postSignUp
} from '../controllers/auth';
import { body } from 'express-validator';
import { UserModel } from '../model/user.model';
import { compare } from 'bcryptjs';

export const authRoutes = express.Router();

authRoutes.get('/login', getLogin);

authRoutes.get('/signup', getSignUp);

authRoutes.get('/reset-password', getResetPassword);

authRoutes.get('/reset/:token', getNewPassword);

authRoutes.post(
  '/login',
  body('email')
    .custom(async (email, { req: { body: { password } } }) => {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error(`User with email "${email}" does not exist.`);
      }

      const passwordsMatch = await compare(password, user.password);

      if (!passwordsMatch) {
        throw new Error('Invalid password');
      }
      return true;
    }),
  postLogin
);

authRoutes.post('/logout', postLogout);

authRoutes.post(
  '/signup',
  body('email')
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });

      if (user) {
        throw new Error(`User with email ${email} already exists.`);
      }
      return true;
    })
    .normalizeEmail(),
  body('password', 'Invalid Password')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords are not equal');
      }
      return true;
    })
    .trim(),
  postSignUp
);

authRoutes.post('/reset-password', postResetPassword);

authRoutes.post('/new-password', postNewPassword);


