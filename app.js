var createError = require('http-errors');
var express = require('express');
var path = require('path');
var methodOverride = require("method-override")
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session")

// konfigurasi halaman admin
const adminRouter = require('./app/admin/router');
const locationRouter = require('./app/location/router');
const sportRouter = require('./app/sport/router');

// konfigurasi API
const authRouter = require("./app/auth/router")
const userRouter = require("./app/user/router")

const app = express();
const URL = "/api/v1";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))
app.use(methodOverride("_method"))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// konfigurasi haaman admin
app.use('/', adminRouter);
app.use('/location', locationRouter);
app.use('/sport', sportRouter);

// konfigurasi API
app.use(`${URL}/users`, userRouter)
app.use(`${URL}/auth`, authRouter)

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
