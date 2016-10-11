"use strict";

var express = require('express');
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var nconf = require('nconf');
var bodyParser = require('body-parser');

var pug = require('pug');
var mongoose = require('mongoose');
var expressPaginate = require('express-paginate');
var passport = require('passport');
var session = require('express-session');

nconf.file("config.json");

mongoose.connect(nconf.get("db:connection"));

require('./config/passport')(passport);

var index = require('./routes/index.js');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

app.use(session({secret: 'secretsessionpasscode'}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/users.js')(app, passport);

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {message: err.message, error: err });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
