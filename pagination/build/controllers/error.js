"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get404 = function (req, res) {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/' });
};
exports.get404 = get404;
