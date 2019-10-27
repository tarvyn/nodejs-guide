import express = require('express');
import {
  getAddProduct,
  getAdminProducts,
  getEditProduct,
  postAddProduct,
  postDeleteProduct,
  postEditProduct
} from '../controllers/admin';
import { isAuthenticated } from '../middleware/is-auth';
import { body } from 'express-validator';

export const adminRoutes = express.Router();

const saveProductValidators = [
  body('title')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .withMessage('Incorrect title')
    .trim(),
  body('imageUrl')
    .isURL()
    .withMessage('Incorrect image url'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Incorrect price'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Incorrect description')
];

adminRoutes.get('/add-product', isAuthenticated, getAddProduct);

adminRoutes.post(
  '/add-product',
  isAuthenticated,
  saveProductValidators,
  postAddProduct
);

adminRoutes.get('/products', isAuthenticated, getAdminProducts);

adminRoutes.get(
  '/edit-product/:productId',
  isAuthenticated,
  getEditProduct
);

adminRoutes.post(
  '/edit-product',
  isAuthenticated,
  saveProductValidators,
  postEditProduct
);

adminRoutes.post('/delete-product', isAuthenticated, postDeleteProduct);