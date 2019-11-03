import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import * as path from 'path';
import { OrderModel } from '../model/order';
import { ProductInfo, ProductModel } from '../model/product.model';
import { deleteFile } from '../util/file';

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
  const image = req.file;
  const user = req.user;
  const product = new ProductModel({
    ...productInfo,
    userId: user,
    imageUrl: image && `/images/${image.filename}`
  });
  const errors = validationResult(req);

  if (!errors.isEmpty() || !image) {
    return res.status(422).render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: false,
      validationErrors: {
        ...errors.mapped(),
        ...(image ? {} : { image: { msg: 'Incorrect image file' } })
      }
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
  const image = req.file;
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
    const imageUrl = image && `/images/${image.filename}`;

    if (image) {
      await deleteFile(path.join(__dirname, '../', product.imageUrl));
    }
    await product.update({ imageUrl, ...productInfo });
  } catch (e) {
    return next(new Error('Error while updating the product occurred.'));
  }

  res.redirect('/admin/products');
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  // const userId = req.user && req.user._id;
  const { productId } = req.params;
  const product = await ProductModel.findById(productId);

  // if (product.userId.toString() !== userId.toString()) {
  //   return res.redirect('/');
  // }

  try {
    await ProductModel.findByIdAndDelete(productId);
    await deleteFile(path.join(__dirname, '../', product.imageUrl));
    // TODO: fix this temporary workaround
    // await OrderModel.deleteMany(() => {});
  } catch (e) {
    res.status(500).json({message: e});
  }
  res.status(200).json({message: 'Success'});
};

export const getAdminProducts: RequestHandler = async (req, res, next) => {
  const userId = req.user && req.user._id;
  let prods = [];

  if (userId) {
    try {
      prods = await ProductModel.find({ userId });
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
