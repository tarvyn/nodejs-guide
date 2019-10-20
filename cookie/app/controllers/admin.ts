import { RequestHandler } from 'express';
import { ProductInfo, ProductModel } from '../model/product.model';

export const getAddProduct: RequestHandler = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};

export const getEditProduct: RequestHandler = async (req, res) => {
  const { query: { edit }, params: { productId } } = req;
  const product = await ProductModel.findById(productId);

  res.render('admin/edit-product', {
    product,
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: edit,
    isAuthenticated: req.session && req.session.isLoggedIn
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
  const { id, ...productInfo } = req.body as ProductInfo;

  await ProductModel.findByIdAndUpdate(id, productInfo);
  res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req, res) => {
  const { id } = req.body;

  await ProductModel.findByIdAndDelete(id);
  res.redirect('/admin/products')
};

export const getAdminProducts: RequestHandler = async (req, res) => {
  const prods = await ProductModel.find();

  res.render('admin/products', {
    prods,
    pageTitle: 'Admin Products',
    path: '/admin/products',
    isAuthenticated: req.session && req.session.isLoggedIn
  });
};
