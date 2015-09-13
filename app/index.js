/**
 *  Copyright (c) 2015 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : meansfw
 *  File : index
 *  Date : 9/13/15 11:40 AM
 *  Description :
 *
 */
'use strict';
var express = require("express");
var morgan = require('morgan');

var routes = require("./routes");

var app = express();

// Express setup
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.use(morgan('dev'));


// Setup Static
app.use(express.static('public'));

// Setup Routes
routes.forEach(function(route) {
    app.use(route.path, route.router);
});



exports = module.exports = app;
