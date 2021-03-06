import { RequestHandler } from 'express';
import { createWriteStream } from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { OrderModel } from '../model/order';
import { ProductModel } from '../model/product.model';

export const getProducts: RequestHandler = async (req, res) => {
  const prods = await ProductModel.find();

  res.render('shop/product-list', {
    prods,
    pageTitle: 'Shop',
    path: '/products'
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
  const prods = await ProductModel.find();

  res.render('shop/index', {
    prods,
    pageTitle: 'Shop',
    path: '/',
    csrfToken: req.csrfToken()
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

export const getCheckout: RequestHandler = (req, res, next) => {
  res.render('shop/checkout', {
    prods: [],
    pageTitle: 'Checkout',
    path: '/cart'
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
