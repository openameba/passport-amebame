"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('login');
var passport = require('passport');
var session = require('express-session');
var AmebameStrategy = require('passport-amebame').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('port', process.env.PORT || 3001);

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var clientId = 'YOUR APPLICATION CLIENT ID';
var clientSecret = 'YOUR APPLICATION CLIENT SECRET';
var scope = 'profile,application,connection,photo,coin';

passport.use(new AmebameStrategy({
    siteURL: "http://localhost/",
    clientID: clientId,
    clientSecret: clientSecret,
    scope: scope,
    authOrigin: 'https://sb.dauth.user.ameba.jp',
    profileOrigin: 'https//sb-profile-api.ameba.jp',
  },
  function(accessToken, refreshToken, params, profile, done) {
    process.nextTick(function() {
      done(null, profile);
    });
  }
));

app.get('/login', passport.authenticate('amebame'));

app.get('/login_callback',
  function(req, res, next) {
    passport.authenticate('amebame', function(err, user) {
      if (err) {
        return res.redirect('/?ng=0');
      }
      if (!user) {
        return res.redirect('/?ok=1');
      }
      req.login(user, {session: true}, function() {
        res.redirect('/?ok=2');
      });
    });
  }
);

app.use('/', function(req, res) {
  var status = 'login';
  if (req.isAuthenticated()) {
    status = 'logined'; 
  }
  var html = '<ul>' +
             '<li><a href="/login">' + status + '</a></li>' +
             '<li><a href="/login?provider_id=twitter">login provider_id=twitter</a></li>' +
             '<li><a href="/login?frm_id=frmid">login frm_id</a></li>' +
             '<li><a href="/login?frm_id=frmid2&state=hello">login state</a></li>' +
             '</ul>';
  res.send(html);
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
