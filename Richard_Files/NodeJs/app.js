var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var upload = require("express-fileupload");
var session = require('express-session');
var bodyParser = require('body-parser');

var conHandlerFactory = require('./conHandler.js');

var indexRouter = require('./routes/index');
var mainRouter = require('./routes/main');

var app = express();

app.set('conHandler', new conHandlerFactory());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload());

app.use(session({
	secret: 'such_a_big_secret',
	resave: true,
	saveUninitialized: true
}));

app.all('/main/*', function(req, res, next){
  var username = "";
  try{
    username = req.session.username;
  } catch (e){
    res.redirect("/");
    return;
  }
  next();
});

app.all('/main', function(req, res, next){
  var username = "";
  try{
    username = req.session.username;
  } catch (e){
    res.redirect("/");
    return;
  }
  next();
})

app.use('/', indexRouter);
app.use('/main', mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
