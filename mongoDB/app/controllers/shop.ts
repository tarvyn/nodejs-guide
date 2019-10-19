import { RequestHandler } from 'express';
import { ProductModel } from '../model/product.model';
import { RequestWithUser } from '../model/request-with-user';

export const getProducts: RequestHandler = (req, res) => {
  ProductModel.fetchAll()
    .then(prods => {
      res.render('shop/product-list', {
        prods,
        pageTitle: 'Shop',
        path: '/products'
      });
    });
};

export const getProduct: RequestHandler = (req, res) => {
  const { productId } = req.params;

  ProductModel.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product && product.title,
        path: '/products'
      });
    });
};


export const getIndex: RequestHandler = (req, res) => {
  ProductModel.fetchAll()
    .then(prods => {
      res.render('shop/index', {
        prods,
        pageTitle: 'Shop',
        path: '/'
      });
    });
};

export const getCart: RequestHandler = (req: RequestWithUser, res) => {
  const { user } = req;

  if (!user) {
    return;
  }
  res.render('shop/cart', {
    products: Object.values(user.cart.products),
    totalPrice: user.cart.totalPrice,
    pageTitle: 'Your cart',
    path: '/cart'
  });
};

export const postCart: RequestHandler = async (req: RequestWithUser, res) => {
  const { user, body: { productId } } = req;

  if (!user) {
    return;
  }

  await user.addProductToCart(productId);
  res.redirect('/');
};

export const removeProductFromCart: RequestHandler = async (req: RequestWithUser, res) => {
  const { productId } = req.body;
  const { user } = req;

  if (!user) {
    return;
  }

  await user.removeProductFromCart(productId);
  res.redirect('/cart')
};

export const getOrders: RequestHandler = async (req: RequestWithUser, res) => {
  const { user } = req;

  if (!user) {
    return;
  }

  const orders = await user.getOrders();

  res.render('shop/orders', {
    orders,
    pageTitle: 'Orders',
    path: '/orders'
  });
};

export const postOrder: RequestHandler = async (req: RequestWithUser, res) => {
  const {user} = req;

  if (!user) {
    return;
  }

  await user.addOrder();
  res.redirect('/orders');
};

export const getCheckout: RequestHandler = (req, res) => {
  ProductModel.fetchAll()
    .then(prods => {
      res.render('shop/checkout', {
        prods,
        pageTitle: 'Checkout',
        path: '/cart'
      });
    });
};
