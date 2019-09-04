import { Request, RequestHandler } from 'express';
import { Product, ProductModel } from '../model/product';
import { UserModel } from '../model/user';

interface RequestWithUser extends Request {
  user?: UserModel;
}

export const getAddProduct: RequestHandler = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

export const getEditProduct: RequestHandler = (req, res) => {
  const { query: { edit }, params: { productId } } = req;

  Product
    .findByPk(productId)
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
  const { id, title, imageUrl, description, price } = req.body;

  Product
    .findByPk<ProductModel>(id)
    .then(product => {
      if (product) {
        product.title = title;
        product.imageUrl = imageUrl;
        product.description = description;
        product.price = price;

        return product.save();
      }
      return undefined as any;
    })
    .then(() => res.redirect('/admin/products'));
};

export const postDeleteProduct: RequestHandler = (req, res) => {
  const { id } = req.body;

  Product
    .findByPk(id)
    .then(product => product && product.destroy())
    .then(() => res.redirect('/admin/products'));
};


export const postAddProduct: RequestHandler = (req: RequestWithUser, res) => {
  const { description, imageUrl, price, title } = req.body;

  Product
    .create({
      description,
      imageUrl,
      price,
      title,
      userId: req.user && req.user.id
    })
    .then(() => res.redirect('/admin/products'));
};

export const getAdminProducts: RequestHandler = (req, res) => {
  Product.findAll()
    .then(prods => {
      res.render('admin/products', {
        prods,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
};
