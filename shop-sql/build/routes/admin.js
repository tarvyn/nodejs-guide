"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var adminRoutes = express.Router();
exports.adminRoutes = adminRoutes;
var products = [];
exports.products = products;
// /admin/add-product => GET
adminRoutes.get('/add-product', function (req, res) {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
});
// /admin/add-product => POST
adminRoutes.post('/add-product', function (req, res) {
    products.push({ title: req.body.title });
    res.redirect('/');
});
