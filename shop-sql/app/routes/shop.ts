import express = require('express');
import {
  getCart,
  getCheckout,
  getIndex,
  getOrders,
  getProduct,
  getProducts,
  postCart,
  postDeleteCartItem
} from '../controllers/shop';

const shopRoutes = express.Router();

shopRoutes.get('/', getIndex);

shopRoutes.get('/products', getProducts);

shopRoutes.get('/products/:productId', getProduct);

shopRoutes.get('/cart', getCart);

shopRoutes.post('/cart', postCart);

shopRoutes.post('/cart-delete-item', postDeleteCartItem);

shopRoutes.get('/checkout', getCheckout);

shopRoutes.get('/orders', getOrders);

export { shopRoutes };
