import { RequestHandler } from 'express';
import { ProductInfo, ProductModel } from '../model/product.model';

export const getAddProduct: RequestHandler = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

export const getEditProduct: RequestHandler = async (req, res) => {
  const { query: { edit }, params: { productId } } = req;
  const product = await ProductModel.findById(productId);

  res.render('admin/edit-product', {
    product,
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: edit
  });
};

export const postAddProduct: RequestHandler = async (req, res) => {
  const productInfo: ProductInfo = req.body;
  const user = req.user;
  const product = new ProductModel({ ...productInfo, userId: user });

  await product.save();
  res.redirect('/');
};

export const postEditProduct: RequestHandler = async (req, res) => {
  const userId = req.user && req.user._id;
  const { id, ...productInfo } = req.body as ProductInfo;
  const product = await ProductModel.findById(id);

  if (product.userId.toString() !== userId.toString()) {
    return res.redirect('/');
  }

  await product.update(productInfo);
  res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req, res) => {
  const userId = req.user && req.user._id;
  const { id } = req.body;
  const product = await ProductModel.findById(id);

  if (product.userId.toString() !== userId.toString()) {
    return res.redirect('/');
  }

  await ProductModel.findByIdAndDelete(id);
  res.redirect('/admin/products')
};

export const getAdminProducts: RequestHandler = async (req, res) => {
  const userId = req.user && req.user._id;
  let prods = [];

  if (userId) {
    prods = await ProductModel.find({userId})
  }

  res.render('admin/products', {
    prods,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};
