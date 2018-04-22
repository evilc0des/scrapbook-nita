var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
var cors = require('cors');

var indexRouter = require('./routes/index');
var notesRouter = require('./routes/post');

var app = express();
mongoose.connect("mongodb://scrapbookadmin:nitascrapbook@ds139585.mlab.com:39585/bittaker", {
		/* other options */
	}).then(() => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
		console.log('Connected to MongoDB');
	},(err) => { /** handle initial connection error */ 
		console.log(`Unable to connect to MongoDB : ${err}`);
	}
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/notes', notesRouter);

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
