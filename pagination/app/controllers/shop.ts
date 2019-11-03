import { RequestHandler } from 'express';
import { createWriteStream } from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { OrderModel } from '../model/order';
import { ProductModel } from '../model/product.model';
import Stripe from 'stripe';

export const ITEMS_PER_PAGE = 1;
const stripeAPIKey = 'sk_test_oxA7SS5TTZTtXKz6WsZJPOxG00SW2DDWln';
const stripe = new Stripe(stripeAPIKey);

export const getProducts: RequestHandler = async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const productsCount = await ProductModel.find().countDocuments();
  const prods = await ProductModel
    .find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  res.render('shop/product-list', {
    prods,
    pageTitle: 'Shop',
    path: '/products',
    productsCount,
    showNextPage: ITEMS_PER_PAGE * page < productsCount,
    showPreviousPage: page > 1,
    currentPage: page,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE)
  });
};

export const getProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const product = await ProductModel.findById(productId);

  res.render('shop/product-detail', {
    product,
    pageTitle: product && product.title,
    path: '/products'
  });
};

export const getIndex: RequestHandler = async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const productsCount = await ProductModel.find().countDocuments();

  const prods = await ProductModel
    .find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  res.render('shop/index', {
    prods,
    pageTitle: 'Shop',
    path: '/',
    csrfToken: req.csrfToken(),
    productsCount,
    showNextPage: ITEMS_PER_PAGE * page < productsCount,
    showPreviousPage: page > 1,
    currentPage: page,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE)
  });
};

export const getCart: RequestHandler = async (req, res) => {
  const productIds = new Set();
  const { user } = req;

  if (!user) {
    return res.redirect('/login');
  }

  user.cart.products.forEach(({ productId: id }) => productIds.add(id));

  const products = await ProductModel.find({ _id: { $in: Array.from(productIds.values()) } });
  const productsMap = products.reduce((map, product) => ({ ...map, [product.id]: product }), {});

  res.render('shop/cart', {
    products: user.cart.products,
    totalPrice: user.cart.totalPrice,
    pageTitle: 'Your cart',
    path: '/cart',
    productsMap
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
  const productIds = new Set();
  const orders = await OrderModel.find();

  orders.forEach(({ items }) =>
    items.forEach(({ productId: id }) => productIds.add(id)));

  const products = await ProductModel.find({ _id: { $in: Array.from(productIds.values()) } });
  const productsMap = products.reduce((map, product) => ({ ...map, [product.id]: product }), {});

  res.render('shop/orders', {
    orders,
    pageTitle: 'Orders',
    path: '/orders',
    productsMap
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

export const getCheckout: RequestHandler = async (req, res, next) => {
  const productIds = new Set();
  const { user } = req;

  if (!user) {
    return res.redirect('/login');
  }

  user.cart.products.forEach(({ productId: id }) => productIds.add(id));

  const products = await ProductModel.find({ _id: { $in: Array.from(productIds.values()) } });
  const productsMap = products.reduce((map, product) => ({ ...map, [product.id]: product }), {});

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: user.cart.products.map(({productId: {_id}, quantity}) => {
        const product = productsMap[_id.toString()];

        return {
          quantity,
          name: product.title,
          description: product.description,
          amount: product.price * 100,
          currency: 'usd'
        };
      }),
      success_url: 'http://localhost:3000/checkout/success',
      cancel_url: 'http://localhost:3000/checkout/cancel'
    });
  } catch (e) {
    console.log(e);
  }

  res.render('shop/checkout', {
    stripeAPIKey,
    sessionId: session.id,
    productsMap,
    products: user.cart.products,
    totalPrice: user.cart.totalPrice,
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};

export const getInvoice: RequestHandler = async (req, res, next) => {
  const { params: { orderId }, user } = req;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join('app', 'invoices', invoiceName);
  const order = await OrderModel.findById(orderId);
  const productIds = new Set();

  order.items.forEach(({ productId: id }) => productIds.add(id));

  const products = await ProductModel.find({ _id: { $in: Array.from(productIds.values()) } });
  const productsMap = products.reduce((map, product) => ({ ...map, [product.id]: product }), {});

  if (order.userId._id.toString() !== user._id.toString()) {
    next(new Error('Unauthorized'));
  }

  const pdfDocument = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

  pdfDocument.pipe(createWriteStream(invoicePath));
  pdfDocument.pipe(res);
  pdfDocument.fontSize(26).text('Invoice', { underline: true });
  pdfDocument.fontSize(26).text('------------------------');
  pdfDocument.fontSize(14);
  order.items.forEach(({ productId, quantity }) => {
    const product = productsMap[productId._id.toString()];

    pdfDocument.text(`${product.title} - (${quantity}) $(${product.price})`)
  });
  pdfDocument.end();
};
