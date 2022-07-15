# passport-amebame


[Passport](http://passportjs.org/) strategy for authenticating with Amebame using the OAuth 2.0 API.


## install

```
$ npm install passport-amebame --save
```

## 使い方

### Configure Strategy

```
passport.use(new AmebameStrategy({
    siteURL: "http://localhost/",
    clientID: AMEBAME_CLIENT_ID,
    clientSecret: AMEBAME_CLIENT_SECRET,
    scope: scope,
    sandbox: true
  },
  function(accessToken, refreshToken, params, profile, done) {
    User.findOrCreate({amebameId: profile.id, as_id: params.as_id}, function(err, user) {
      return done(err, user);
    });
  }
));
```

### Authenticate Request


```
app.get('/auth/amebame',
  passport.authenticate('amebame'));

app.get('/auth/amebame/callback',
    function(req, res, next) {
      passport.authenticate('amebame', function(err, user, info) {
        // You can also check with status code in err
        if (err) {
          res.redirect("/error");
        } else {
          req.login(user, {session: true}, function() {
            res.redirect('/');
          });
        }
      })(req, res, next);
    });
```
