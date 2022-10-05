"use strict";

var vows = require('vows')
  , assert = require('assert')
  , sinon = require('sinon')
  , AmebameStrategy = require('passport-amebame/strategy');

/**
 * mock
 */
AmebameStrategy.prototype.redirect = function(location) {
  return location;
};

var graphMeData = require('./graph_me_mock.json');
var graphMeDataString = JSON.stringify(graphMeData);

vows.describe('AmebameStrategy').addBatch({
  'strategy': {
    topic: function() {
      return new AmebameStrategy({
        clientID: 'clientID',
        clientSecret: 'secret',
        siteURL: 'http://example.jp'
      }, function() {});
    },
    'should be named amebame': function(strategy) {
      assert.equal(strategy.name, 'amebame');
    }
  },
  'strategy when loading user profile from api': {
    topic: function() {
      var strategy = new AmebameStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        siteURL: 'http://example.jp',
      }, function() {});

      return strategy;
    },
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        process.nextTick(function() {
          // mock
          strategy._oauth2.get = function(url, accessToken, callback) {
            var body = graphMeDataString;
            callback(null, body, undefined);
          };

          strategy.userProfile('accessToken', done);
        });
      },
      'should not error': function(err, profile) {
        assert.isNull(err);
        assert.isNotNull(profile);
      },
      'should eql id': function(err, profile) {
        assert.equal(profile.id, "45148");
      },
      'should eql displayName': function(err, profile) {
        assert.equal(profile.displayName, "ame2");
      },
      'should eql imageUrl': function(err, profile) {
        assert.equal(profile.imageUrl, "https://example.com/example.jpeg");
      },
      'should eql gender': function(err, profile) {
        assert.equal(profile.gender, "female");
      },
      'should eql birthday': function(err, profile) {
        assert.equal(profile.birthday, "03/02/1980");
      }
    },
  },
  'authorization': {
    "redirect to location": {
      topic: function() {
        var strategy = new AmebameStrategy({
          clientID: 'ABC123',
          clientSecret: 'secret',
          siteURL: 'http://example.jp',
        }, function() {});

        var req = {query: {frm_id: "frmId"}}
          , options = {}
          , redirectUrl;

        process.nextTick(function() {
          sinon.spy(strategy, "redirect");
          strategy.authenticate(req, options);

          // TODO: parse querystring
          redirectUrl = 'https://sb.dauth.user.ameba.jp/authorize?frm_id=frmId&response_type=code&redirect_uri=&scope=profile%2Capplication%2Cconnection%2Cphoto%2Ccoin&client_id=ABC123';
          assert.isTrue(strategy.redirect.withArgs(redirectUrl).calledOnce);
        });
      },
    },
    'with code': {
      topic: function() {
        var strategy = new AmebameStrategy({
          clientID: 'ABC123',
          clientSecret: 'secret',
          siteURL: 'http://example.jp',
        }, this.callback);

        // mock
        strategy._oauth2.getOAuthAccessToken = function(code, params, callback) {
          callback(null, "accessToken", "refreshToken", params);
        };
        strategy._oauth2.get = function(url, accessToken, callback) {
          var body = graphMeDataString;
          callback(null, body, undefined); 
        };

        strategy.authenticate({query: {code: "code"}}, {});
      },
      "should get access_token": function(accessToken, refreshToken, profile, verified) {
        assert.equal(accessToken, "accessToken");
        assert.equal(refreshToken, "refreshToken");
        assert.isNotNull(profile);
        assert.isFunction(verified);
      }
    }
  }
}).export(module);
