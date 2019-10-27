import { RequestHandler } from 'express';
import { ProductInfo, ProductModel } from '../model/product.model';
import { validationResult } from 'express-validator';

export const getAddProduct: RequestHandler = (req, res) => {
  res.render('admin/edit-product', {
    product: {},
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    validationErrors: {}
  });
};

export const getEditProduct: RequestHandler = async (req, res, next) => {
  const { query: { edit }, params: { productId } } = req;
  let product;

  try {
    product = await ProductModel.findById(productId)
  } catch (e) {
    next(new Error('Error while fetching the product occurred.'));
  }

  res.render('admin/edit-product', {
    product,
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: edit,
    validationErrors: {}
  });
};

export const postAddProduct: RequestHandler = async (req, res, next) => {
  const productInfo: ProductInfo = req.body;
  const user = req.user;
  const product = new ProductModel({ ...productInfo, userId: user });
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: false,
      validationErrors: errors.mapped()
    });
  }

  try {
    await product.save();
  } catch (e) {
    next(new Error('Error while saving product occurred.'));
  }
  res.redirect('/');
};

export const postEditProduct: RequestHandler = async (req, res, next) => {
  const userId = req.user && req.user._id;
  const { id, ...productInfo } = req.body as ProductInfo;
  const errors = validationResult(req);
  let product;

  try {
    product = await ProductModel.findById(id)
  } catch (e) {
    next(new Error('Error while fetching the product occurred.'));
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      validationErrors: errors.mapped()
    });
  }

  if (product.userId.toString() !== userId.toString()) {
    return res.redirect('/');
  }

  try {
    await product.update(productInfo);
  } catch (e) {
    next(new Error('Error while updating the product occurred.'));
  }

  res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req, res, next) => {
  const userId = req.user && req.user._id;
  const { id } = req.body;
  const product = await ProductModel.findById(id);

  if (product.userId.toString() !== userId.toString()) {
    return res.redirect('/');
  }

  try {
    await ProductModel.findByIdAndDelete(id);
  } catch (e) {
    next(new Error('Error while deleting the product occurred.'));
  }
  res.redirect('/admin/products')
};

export const getAdminProducts: RequestHandler = async (req, res, next) => {
  const userId = req.user && req.user._id;
  let prods = [];

  if (userId) {
    try {
      prods = await ProductModel.find({userId});
    } catch (e) {
      next(new Error('Error while fetching the product occurred.'));
    }
  }

  res.render('admin/products', {
    prods,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};
