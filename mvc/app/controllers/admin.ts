import { RequestHandler } from 'express';
import { Product } from '../model/product';

export const getAddProduct: RequestHandler = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

export const getEditProduct: RequestHandler = (req, res) => {
  const { query: { edit }, params: { productId } } = req;

  Product.findById(productId)
    .then(product => {
      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: edit
      });
    });
};

export const postEditProduct: RequestHandler = (req, res) => {
  const { id, title, imageUrl, description, price } = req.body as Product;
  const updatedProduct = new Product(id, title, imageUrl, description, price);

  updatedProduct.save();
  res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = (req, res) => {
  const { id } = req.body;

  Product.deleteProduct(id)
    .then(() => res.redirect('/admin/products'));
};


export const postAddProduct: RequestHandler = (req, res) => {
  const { description, imageUrl, price, title } = req.body as Product;
  const product = new Product(undefined, title, imageUrl, description, Number(price));

  product.save();
  res.redirect('/');
};

export const getAdminProducts: RequestHandler = (req, res) => {
  Product.fetchAll()
    .then(prods => {
      res.render('admin/products', {
        prods,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
};
