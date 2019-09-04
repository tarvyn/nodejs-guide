"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var path = __importStar(require("path"));
var admin_1 = require("./routes/admin");
var shop_1 = require("./routes/shop");
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', admin_1.adminRoutes);
app.use(shop_1.shopRoutes);
app.use(function (req, res) {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});
app.listen(3000);
