var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cors = require('cors');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var delay = require('delay');


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
var dbOptions = {
  keepAlive: 200,
  autoReconnect: true,
  reconnectInterval: 3000,
  useNewUrlParser: true
};

var reconnectTries = 0;
var trialDelay = 1;

function delayString(seconds) {
  var sec = seconds % 60;
  seconds -= sec;
  var min = seconds / 60;
  var temp = min;
  min %= 60;
  var hour = (temp - min) / 60;

  var str = '';
  if (hour>0) {
    str += hour;
    str += ' hour'
    if (hour>1) str += 's';
    if (min>0 || sec>0) str += ', ';
  }
  if (min>0) {
    str += min;
    str += ' minute'
    if (min>1) str += 's';
    if (sec>0) str += ', ';
  }
  if (sec>0) {
    str += sec;
    str += ' second'
    if (sec>1) str += 's';
  }
  return str; 
}
function dbConnect() {
  console.log('Connecting database ...');
  mongoose.connect(
    // Replace CONNECTION_URI with your connection uri
    'CONNECTION_URI',
    dbOptions
  ).then(function() {
    console.log('Database connection successful !!!');
    console.log('Server is fully functional');
  }, function(err) {
    console.log('Database connection failed');

    reconnectTries++;
    console.log('Reconnecting after '+delayString(trialDelay));
    console.log('Reconnect trial: '+reconnectTries);
    console.log('');
    delay(trialDelay*1000).then(function() {
      trialDelay += trialDelay;
      if (trialDelay>7200) trialDelay = 7200;
      // enable recurtion
      dbConnect();
    });
  });
}
dbConnect();

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
