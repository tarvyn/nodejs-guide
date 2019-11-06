import { compare, hash } from 'bcryptjs';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';
import { User, UserModel } from '../models/user.model';
import { catchPromiseError } from '../utils/catch-promise-error';

export const secretKey = '*+10|+rE[)7nvFwhhn&/]z$N*T==xC';
export interface AuthTokenPayload {
  userId: User['id'];
  email: User['email'];
}

export const signUp: RequestHandler = async (req, res, next) => {
  const { body: { name, email, password } } = req;
  const errors = validationResult(req);
  const hashedPassword = await hash(password, 12);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed. Entered data is incorrect',
      errors: errors.array()
    });
  }

  const userToCreate = new UserModel({ name, email, password: hashedPassword });

  const [saveUserError, user] = await catchPromiseError(userToCreate.save());

  if (saveUserError) {
    next(saveUserError);
  }

  return res.status(201).json({
    message: 'User created successfully',
    userId: user._id.toString()
  });
};

export const login: RequestHandler = async (req, res, next) => {
  const { body: { email, password } } = req;

  const [getUserError, user] = await catchPromiseError(UserModel.findOne({ email }));
  const userId = user && user._id.toString();

  if (getUserError) {
    return next(getUserError);
  }

  if (!user) {
    return res.status(401).json({ message: 'User was not found' });
  }

  const passwordIsValid = await compare(password, user.password);

  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Wrong password' });
  }

  const token = sign(
    { userId, email: user.email },
    secretKey,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, userId })
};


export const getUserStatus: RequestHandler = async (req, res, next) => {
  const { userId } = req;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const [getUserError, {status}] = await catchPromiseError(UserModel.findById(userId));

  if (getUserError) {
    return next(getUserError);
  }

  res.status(200).json({ status });
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const { userId, body: userToUpdate } = req;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const [getUserError, user] = await catchPromiseError(UserModel.findById(userId));

  if (getUserError) {
    return next(getUserError);
  }

  Object.assign(user, userToUpdate);

  const [updateUserError, {status}] = await catchPromiseError(user.save());

  if (updateUserError) {
    return next(updateUserError);
  }

  res.status(200).json({ status });
};

