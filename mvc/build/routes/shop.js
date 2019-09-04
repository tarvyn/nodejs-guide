"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var admin_1 = require("./admin");
var shopRoutes = express.Router();
exports.shopRoutes = shopRoutes;
shopRoutes.get('/', function (req, res) {
    res.render('shop', {
        prods: admin_1.products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: admin_1.products.length > 0,
        activeShop: true,
        productCSS: true
    });
});
