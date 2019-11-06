import express from 'express';
import { body } from 'express-validator';
import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/feed';
import { isAuth } from '../middlewares/is-auth';

export const feedRoutes = express.Router();

feedRoutes.get('/posts', isAuth, getPosts);
feedRoutes.get('/post/:postId', isAuth, getPost);
feedRoutes.delete('/post/:postId', isAuth, deletePost);

feedRoutes.put(
  '/post/:postId',
  isAuth,
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 }),
  updatePost
);
feedRoutes.post(
  '/post',
  isAuth,
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 }),
  createPost
);
