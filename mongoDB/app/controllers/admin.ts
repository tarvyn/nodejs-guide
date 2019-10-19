import { RequestHandler } from 'express';
import { Product, ProductModel } from '../model/product.model';
import { RequestWithUser } from '../model/request-with-user';
import { User, UserModel } from '../model/user.model';

export const getAddProduct: RequestHandler = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

export const getEditProduct: RequestHandler = (req, res) => {
  const { query: { edit }, params: { productId } } = req;

  ProductModel.findById(productId)
    .then(product => {
      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: edit
      });
    });
};

export const postAddProduct: RequestHandler = async (req: RequestWithUser, res) => {
  const { description, imageUrl, price, title } = req.body as ProductModel;
  const { id: userId } = req.user as UserModel;
  const product = new ProductModel(
    title, Number(price), description, imageUrl, undefined, userId
  );

  await product.save();
  res.redirect('/');
};


export const postEditProduct: RequestHandler = async (req: RequestWithUser, res) => {
  const { id, title, imageUrl, description, price } = req.body as ProductModel;
  const { id: userId } = req.user as UserModel;
  const productToBeUpdated = new ProductModel(
    title, Number(price), description, imageUrl, id, userId
  );

  await productToBeUpdated.save();
  res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req: RequestWithUser, res) => {
  const { id } = req.body;
  const { user } = req;

  if (!user) {
    return;
  }

  await user.removeProductFromCart(id);
  await ProductModel.deleteById(id);

  res.redirect('/admin/products')
};

export const getAdminProducts: RequestHandler = (req, res) => {
  ProductModel.fetchAll()
    .then(prods => {
      res.render('admin/products', {
        prods,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
};
