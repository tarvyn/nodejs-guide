import express = require('express');
import {
  getCart,
  getCheckout,
  getIndex,
  getOrders,
  getProduct,
  getProducts,
  postCart, postOrder,
  removeProductFromCart
} from '../controllers/shop';

const shopRoutes = express.Router();

shopRoutes.get('/', getIndex);

shopRoutes.get('/products', getProducts);

shopRoutes.get('/products/:productId', getProduct);

shopRoutes.get('/cart', getCart);

shopRoutes.post('/cart', postCart);

shopRoutes.post('/cart-delete-item', removeProductFromCart);

shopRoutes.get('/checkout', getCheckout);

shopRoutes.get('/orders', getOrders);

shopRoutes.post('/create-order', postOrder);

export { shopRoutes };
