import express from 'express';
import passport from 'passport';
import Amebame from '../lib/passport-amebame/index.js';

const User = {
  findOrCreate(accessToken: string, refreshToken: string, id:string, provider:string, callback:(err:any, user:any) => void): void {
    callback(null, { username: 'amebame' });
  },
};

const CLIENT_ID = '';
const CLIENT_SECRET = '';

passport.use(new Amebame.Strategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
}, function(accessToken, refreshToken, profile, done) {
  User.findOrCreate(accessToken, refreshToken, profile.id, profile.provider, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}));

passport.use(new Amebame.Strategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  authOrigin: 'https://sb.dauth.user.ameba.jp',
  profileOrigin: 'https//sb-profile-api.ameba.jp',
}, function(accessToken, refreshToken, profile, done) {
  User.findOrCreate(accessToken, refreshToken, profile.id, profile.provider, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}));

const strategy = new Amebame.Strategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
}, function() {});

const name = strategy.name;
const authorizationParams = strategy.authorizationParams(express.request);
strategy.authenticate(express.request, { name, ...authorizationParams });
strategy.userProfile('', function (err, user) {
  if (err) {
    return;
  }
  console.log(user);
});
