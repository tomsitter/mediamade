var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = 3000;

// app.use(bodyParser());
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join( __dirname, '../public/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Server Listening on Port ' + port);
  }
});
