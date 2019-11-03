import express = require('express');
import {
  getCart,
  getCheckout,
  getIndex, getInvoice,
  getOrders,
  getProduct,
  getProducts,
  postCart, postOrder,
  removeProductFromCart
} from '../controllers/shop';
import { isAuthenticated } from '../middleware/is-auth';

export const shopRoutes = express.Router();

shopRoutes.get('/', getIndex);

shopRoutes.get('/products', getProducts);

shopRoutes.get('/products/:productId', getProduct);

shopRoutes.get('/cart', isAuthenticated, getCart);

shopRoutes.post('/cart', isAuthenticated, postCart);

shopRoutes.post('/cart-delete-item', isAuthenticated, removeProductFromCart);

shopRoutes.get('/checkout', isAuthenticated, getCheckout);

shopRoutes.get('/orders', isAuthenticated, getOrders);

shopRoutes.post('/create-order', isAuthenticated, postOrder);

shopRoutes.get('/orders/:orderId', isAuthenticated, getInvoice);