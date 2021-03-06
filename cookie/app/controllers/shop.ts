import { RequestHandler } from 'express';
import { ProductModel } from '../model/product.model';
import { OrderModel } from '../model/order';

export const getProducts: RequestHandler = async (req, res) => {
  const prods = await ProductModel.find();

  res.render('shop/product-list', {
    prods,
    pageTitle: 'Shop',
    path: '/products',
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};

export const getProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const product = await ProductModel.findById(productId);

  res.render('shop/product-detail', {
    product,
    pageTitle: product && product.title,
    path: '/products',
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};

export const getIndex: RequestHandler = async (req, res) => {
  const prods = await ProductModel.find();

  res.render('shop/index', {
    prods,
    pageTitle: 'Shop',
    path: '/',
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};

export const getCart: RequestHandler = async (req, res) => {
  const {user} = req;

  if (!user) {
    return res.render('shop/cart', {
      products: [],
      totalPrice: null,
      pageTitle: 'Your cart',
      path: '/cart',
      isAuthenticated: false
    });
  }

  res.render('shop/cart', {
    products: user.cart.products,
    totalPrice: user.cart.totalPrice,
    pageTitle: 'Your cart',
    path: '/cart',
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};

export const postCart: RequestHandler = async (req, res) => {
  const { user, body: { productId } } = req;

  if (!user) {
    return;
  }

  await user.addProductToCart(productId);
  res.redirect('/');
};

export const removeProductFromCart: RequestHandler = async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  if (!user) {
    return;
  }

  await user.removeProductFromCart(productId);
  res.redirect('/cart')
};

export const getOrders: RequestHandler = async (req, res) => {
  const orders = await OrderModel.find();

  res.render('shop/orders', {
    orders,
    pageTitle: 'Orders',
    path: '/orders',
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};

export const postOrder: RequestHandler = async (req, res) => {
  const { user } = req;

  if (!user) {
    return;
  }

  const order = new OrderModel({
    items: user.cart.products,
    userId: user
  });

  await order.save();
  await user.emptyCart();
  res.redirect('/orders');
};

export const getCheckout: RequestHandler = (req, res) => {
  res.render('shop/checkout', {
    prods: [],
    pageTitle: 'Checkout',
    path: '/cart',
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};
