var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
// var favicon = require('serve-favicon');
var logger = require('morgan');
// var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
// var cookieParser = require('cookie-parser');
var url = require('url');

var contacts = require('./controllers/contacts');
var Contact = require('./models/contact');

var config = require('./config.js');

var router = express.Router();

var app = express();


// view engine setup 
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'jade'); 

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// app.use(methodOverride());
app.use(bodyParser.json());
app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

if ('development' == app.get('env')) {
  app.use(errorHandler());
}

mongoose.connect(config.db.text);

app.get('/contacts/:primarycontactnumber', function(request, response) {
  console.log(request.url + ': querying for ' + request.params.primarycontactnumber);
  contacts.findByNumber(Contact, request.params.primarycontactnumber, response);
});

app.post('/contacts', function(request, response) {
  contacts.update(Contact, request.body, response);
});

app.put('/contacts', function(request, response) {
  contacts.create(Contact, request.body, response);
});

app.delete('/contacts/:primarycontactnumber', function(request, response) {
  contacts.remove(Contact, request.params.primarycontactnumber, response);
});

app.get('/contacts', function(request, response) {
  console.log('Listing all contacts with ' + request.params.key + '=' + request.params.value);
  contacts.list(Contact, response);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(8000, function() {
  console.log('App listening on port ' + 8000);
});

module.exports = app;
