"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var product_model_1 = require("../model/product.model");
exports.getAddProduct = function (req, res) {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};
exports.getEditProduct = function (req, res) {
    // const { query: { edit }, params: { productId } } = req;
    //
    // Product.findById(productId)
    //   .then(product => {
    //     res.render('admin/edit-product', {
    //       product,
    //       pageTitle: 'Edit Product',
    //       path: '/admin/edit-product',
    //       editing: edit
    //     });
    //   });
};
exports.postEditProduct = function (req, res) {
    // const { id, title, imageUrl, description, price } = req.body as Product;
    // const updatedProduct = new Product(id, title, imageUrl, description, price);
    //
    // updatedProduct.save();
    res.redirect('/admin/products');
};
exports.postDeleteProduct = function (req, res) {
    // const { id } = req.body;
    //
    // Product.deleteProduct(id)
    //   .then(() => res.redirect('/admin/products'));
};
exports.postAddProduct = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, description, imageUrl, price, title, product;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, description = _a.description, imageUrl = _a.imageUrl, price = _a.price, title = _a.title;
                product = new product_model_1.ProductModel(title, Number(price), description, imageUrl);
                return [4 /*yield*/, product.save()];
            case 1:
                _b.sent();
                res.redirect('/');
                return [2 /*return*/];
        }
    });
}); };
exports.getAdminProducts = function (req, res) {
    product_model_1.ProductModel.fetchAll()
        .then(function (prods) {
        res.render('admin/products', {
            prods: prods,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};
