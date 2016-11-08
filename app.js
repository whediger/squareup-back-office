var express = require('express');
var bodyparser = require('body-parser');


// app config +==}========>

var routes = require('./routes/index');

var app = express();

// uncomment after adding favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true}));
app.use(bodyparser.json());

app.use('/', routes);

var port = process.env.PORT || 3000;
console.log('listening on port: ' + port);

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port);

module.exports = app;
