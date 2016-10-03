var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
// var favicon = require('serve-favicon');
var logger = require('morgan');
// var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
var config = require('./config.js');

var Grid = require('gridfs-stream');
mongoose.connect(config.db.test);

var gfs = Grid(mongoose.connection.db, mongoose.mongo);

// var cookieParser = require('cookie-parser');
var url = require('url');

var contacts_v1 = require('./controllers/contacts_v1');
var contacts_v2 = require('./controllers/contacts_v2');

var Contact = require('./models/contact');

// var router = express.Router();
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

app.get('/v1/contacts/:primarycontactnumber', function(request, response) {
  console.log(request.url + ': querying for ' + request.params.primarycontactnumber);
  contacts_v1.findByNumber(Contact, request.params.primarycontactnumber, response);
});

app.post('/v1/contacts', function(request, response) {
  contacts_v1.update(Contact, request.body, response);
});

app.put('/v1/contacts', function(request, response) {
  contacts_v1.create(Contact, request.body, response);
});

app.delete('/v1/contacts/:primarycontactnumber', function(request, response) {
  contacts_v1.remove(Contact, request.params.primarycontactnumber, response);
});

app.get('/contacts', function(request, response) {
  var args = url.parse(request.url, true).query;
  if (Object.keys(args).length == 0) {
    contacts_v2.list(Contact, response);
  } else {
    JSON.stringify(contacts_v2.query_by_args(Contact, args, response));
  }
});

app.get('/v1/contacts', function(request, response) {
  console.log('Listing all contacts with ' + request.params.key + '=' + request.params.value);
  contacts_v1.list(Contact, response);
});


app.get('/v2/contacts/:primarycontactnumber/image', function(request, response) {
    contacts_v2.getImage(gfs, request.params.primarycontactnumber, response);
});

app.get('/contacts/:primarycontactnumber/image', function(request, response) {
    contacts_v2.getImage(gfs, request.params.primarycontactnumber, response);
});

app.post('/v2/contacts/:primarycontactnumber/image', function(request, response) {
  contacts_v2.updateImage(gfs, request, response);
});

app.post('/contacts/:primarycontactnumber/image', function(request, response) {
  contacts_v2.updateImage(gfs, request, response);
});

app.put('/v2/contacts/:primarycontactnumber/image', function(request, response) {
  contacts_v2.updateImage(gfs, request, response);
});

app.put('/contacts/:primarycontactnumber/image', function(request, response) {
  contacts_v2.updateImage(gfs, request, response);
});

app.delete('/v2/contacts/:primarycontactnumber/image', function(request, response) {
  contacts_v2.deleteImage(gfs, request.params.primarycontactnumber, response);
});

app.delete('/contacts/:primarycontactnumber/image', function(request, response) {
  contacts_v2.deleteImage(gfs, request.params.primarycontactnumber, response);
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
