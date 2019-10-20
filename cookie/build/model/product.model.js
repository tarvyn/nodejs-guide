"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("../util/database");
var getCollection = function () { return database_1.getDb().collection('product'); };
var ProductModel = /** @class */ (function () {
    function ProductModel(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    ProductModel.prototype.save = function () {
        return getCollection().insertOne(this.getProduct());
    };
    ProductModel.fetchAll = function () {
        return getCollection().find().toArray();
    };
    ProductModel.findById = function (id) {
        return getCollection().find({ _id: id }).next();
    };
    ProductModel.prototype.getProduct = function () {
        var _a = this, title = _a.title, description = _a.description, imageUrl = _a.imageUrl, price = _a.price;
        return { title: title, description: description, imageUrl: imageUrl, price: price };
    };
    return ProductModel;
}());
exports.ProductModel = ProductModel;
