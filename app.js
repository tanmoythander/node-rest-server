var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cors = require('cors');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//initialize mongoose schemas
require('./models/posts');
require('./models/users');
require('./models/logs');
require('./models/admins');

// include the route modules
var user = require('./routes/user');
var admin = require('./routes/admin');
var token = require('./routes/token');

// Require mongoose
var mongoose = require('mongoose');
// Connect to mongoDB
mongoose.connect(
  '<SRV or URI ADDRESS>'
).then(function() {
    console.log('Database connection successful !!!');
  },
  function(err) {
    console.log('Database connection failed');
    console.log(err);
  }
);

// CORS Config
var whitelist = [
  undefined, // POSTMAN Support
  'http://localhost:XXXX', // DEV Support
  'https://example.com' // Production Support
]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(origin + ' is not allowed to access'))
    }
  }
}

// start express app
var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cors(corsOptions));
app.use(logger('dev'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Register the main routes
app.use('/user', user);
app.use('/admin', admin);
app.use('/token', token);

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
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      state: 'failure',
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    state: 'failure',
    message: err.message,
    error: err
  });
});

module.exports = app;
