# passport-amebame


[Passport](http://passportjs.org/) strategy for authenticating with Amebame using the OAuth 2.0 API.


## install

```
$ npm install passport-amebame --save
```

## Usage

### Strategy Configuration

```JavaScript
const Amebame = require('passport-amebame');

passport.use(new Amebame.Strategy({
  clientID: 'YOUR_CLIENT_ID', // Required
  clientSecret: 'YOUR_CLIENT_SECRET', // Required
  scope: '', // Optional
  authOrigin: '', // Optional
  profileOrigin: '', // Optional
}, function(accessToken, refreshToken, params, profile, done) {
  User.findOrCreate({ id: profile.id, profile }, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}));
```

### Authenticate Request

You can see it in [the example application](/example/login/app.js).
