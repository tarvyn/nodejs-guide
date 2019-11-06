import express from 'express';
import { body } from 'express-validator';
import { getUserStatus, login, signUp, updateUser } from '../controllers/auth';
import { isAuth } from '../middlewares/is-auth';
import { UserModel } from '../models/user.model';

export const authRoutes = express.Router();

authRoutes.put(
  '/signup',
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (email, {req}) => {
      const user = await UserModel.findOne({email});

      if (user) {
        throw new Error('Email already exists');
      }
    }),
  body('password').trim().isLength({ min: 5 }),
  body('name').trim().not().isEmpty(),
  signUp
);

authRoutes.post('/login', login);
authRoutes.get('/user/status', isAuth, getUserStatus);
authRoutes.patch('/user', isAuth, updateUser);
