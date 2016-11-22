"use strict";

var express = require('express');
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var pug = require('pug');
var mongoose = require('mongoose');
var expressPaginate = require('express-paginate');
var cors = require('cors');

var nconf = require('nconf');
nconf.file("config.json");

var passport = require('passport');
require('./middlewares/passport')(passport);

if (app.get('env') === 'test') {
    mongoose.connect(nconf.get("db:test"));
} else {
    mongoose.connect(nconf.get("db:dev"));
}

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

app.use('/api', require('./routes/waitlist.js'));

// Authentication required below
app.use('/api', require('./routes/users.js')(passport));

// Token required
app.use('/api', require('./routes/jobs.js'));
app.use('/api', require('./routes/profiles.js'));

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
