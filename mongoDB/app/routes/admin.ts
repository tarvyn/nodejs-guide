import express = require('express');
import {
  getAddProduct,
  getAdminProducts,
  getEditProduct,
  postAddProduct,
  postDeleteProduct,
  postEditProduct
} from '../controllers/admin';

const adminRoutes = express.Router();

// /admin/add-product => GET
adminRoutes.get('/add-product', getAddProduct);

// /admin/add-product => POST
adminRoutes.post('/add-product', postAddProduct);

// /admin/add-product => GET
adminRoutes.get('/products', getAdminProducts);

adminRoutes.get('/edit-product/:productId', getEditProduct);

adminRoutes.post('/edit-product', postEditProduct);

adminRoutes.post('/delete-product', postDeleteProduct);

export { adminRoutes };
