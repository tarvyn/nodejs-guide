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

export const adminRoutes = express.Router();

// /admin/add-product => GET
adminRoutes.get('/add-product', isAuthenticated, getAddProduct);

// /admin/add-product => POST
adminRoutes.post('/add-product', isAuthenticated, postAddProduct);

// /admin/add-product => GET
adminRoutes.get('/products', isAuthenticated, getAdminProducts);

adminRoutes.get('/edit-product/:productId', isAuthenticated, getEditProduct);

adminRoutes.post('/edit-product', isAuthenticated, postEditProduct);

adminRoutes.post('/delete-product', isAuthenticated, postDeleteProduct);