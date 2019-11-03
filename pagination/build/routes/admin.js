"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var admin_1 = require("../controllers/admin");
var adminRoutes = express.Router();
exports.adminRoutes = adminRoutes;
// /admin/add-product => GET
adminRoutes.get('/add-product', admin_1.getAddProduct);
// /admin/add-product => POST
adminRoutes.post('/add-product', admin_1.postAddProduct);
// /admin/add-product => GET
adminRoutes.get('/products', admin_1.getAdminProducts);
adminRoutes.get('/edit-product/:productId', admin_1.getEditProduct);
adminRoutes.post('/edit-product', admin_1.postEditProduct);
adminRoutes.post('/delete-product', admin_1.postDeleteProduct);
