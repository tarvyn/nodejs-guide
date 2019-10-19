"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var cart_1 = require("../model/cart");
var product_model_1 = require("../model/product.model");
exports.getProducts = function (req, res) {
    product_model_1.ProductModel.fetchAll()
        .then(function (prods) {
        res.render('shop/product-list', {
            prods: prods,
            pageTitle: 'Shop',
            path: '/products'
        });
    });
};
exports.getProduct = function (req, res) {
    var productId = req.params.productId;
    product_model_1.ProductModel.findById(productId)
        .then(function (product) {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product && product.title,
            path: '/products'
        });
    });
};
exports.getIndex = function (req, res) {
    product_model_1.ProductModel.fetchAll()
        .then(function (prods) {
        res.render('shop/index', {
            prods: prods,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};
exports.getCart = function (req, res) {
    cart_1.Cart.getCart()
        .then(function (_a) {
        var products = _a.products;
        product_model_1.ProductModel.fetchAll()
            .then(function (prods) {
            res.render('shop/cart', {
                products: products.map(function (product) { return (__assign({}, product, prods.find(function (p) { return p._id === product.id; }))); }),
                pageTitle: 'Your cart',
                path: '/cart'
            });
        });
    });
};
exports.postCart = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var productId, product, _a, _id, price;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                productId = req.body.productId;
                return [4 /*yield*/, product_model_1.ProductModel.findById(productId)];
            case 1:
                product = _b.sent();
                _a = product || {}, _id = _a._id, price = _a.price;
                return [4 /*yield*/, cart_1.Cart.addProduct((_id && _id.toString()) || '', price)];
            case 2:
                _b.sent();
                res.redirect('/');
                return [2 /*return*/];
        }
    });
}); };
exports.postDeleteCartItem = function (req, res) {
    var productId = req.body.productId;
    cart_1.Cart.deleteProduct(productId)
        .then(function () { return res.redirect('/cart'); });
};
exports.getOrders = function (req, res) {
    product_model_1.ProductModel.fetchAll()
        .then(function (prods) {
        res.render('shop/orders', {
            prods: prods,
            pageTitle: 'Your cart',
            path: '/orders'
        });
    });
};
exports.getCheckout = function (req, res) {
    product_model_1.ProductModel.fetchAll()
        .then(function (prods) {
        res.render('shop/checkout', {
            prods: prods,
            pageTitle: 'Checkout',
            path: '/cart'
        });
    });
};
