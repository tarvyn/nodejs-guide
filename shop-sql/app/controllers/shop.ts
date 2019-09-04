import { RequestHandler } from 'express';
import { Cart } from '../model/cart';
import { Product } from '../model/product';

export const getProducts: RequestHandler = (req, res) => {
  Product
    .findAll()
    .then(prods => {
      res.render('shop/product-list', {
        prods,
        pageTitle: 'Shop',
        path: '/products'
      });
    })
    .catch(error => console.log(error));
};

export const getProduct: RequestHandler = (req, res) => {
  const { productId } = req.params;

  Product
    .findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products'
      });
    });
};


export const getIndex: RequestHandler = (req, res) => {
  Product
    .findAll()
    .then(prods => {
      res.render('shop/index', {
        prods,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => console.log(error));
};

export const getCart: RequestHandler = (req, res) => {
  Cart.getCart()
    .then(({ products }) => {
      // Product.fetchAll()
      //   .then(prods => {
      //     res.render('shop/cart', {
      //       products: products.map(product => ({ ...product, ...prods.find(p => p.id === product.id) })),
      //       pageTitle: 'Your cart',
      //       path: '/cart'
      //     });
      //   });
    });
};

export const postCart: RequestHandler = (req, res) => {
  const { productId } = req.body;

  // Product.findById(productId)
  //   .then(({ id, price }) => Cart.addProduct(id as string, price));

  res.redirect('/');
};

export const postDeleteCartItem: RequestHandler = (req, res) => {
  const { productId } = req.body;

  Cart.deleteProduct(productId)
    .then(() => res.redirect('/cart'));
};

export const getOrders: RequestHandler = (req, res) => {
  // Product.fetchAll()
  //   .then(prods => {
  //     res.render('shop/orders', {
  //       prods,
  //       pageTitle: 'Your cart',
  //       path: '/orders'
  //     });
  //   });
};

export const getCheckout: RequestHandler = (req, res) => {
  // Product.fetchAll()
  //   .then(prods => {
  //     res.render('shop/checkout', {
  //       prods,
  //       pageTitle: 'Checkout',
  //       path: '/cart'
  //     });
  //   });
};
