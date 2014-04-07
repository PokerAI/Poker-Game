// Generated by CoffeeScript 1.6.3
(function() {
  var RemoteSeat, Seat, crypto, fs, request, util,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  request = require('request');

  util = require('util');

  crypto = require('crypto');

  Seat = require('../seat').Seat;

  exports.Seat = RemoteSeat = (function(_super) {
    __extends(RemoteSeat, _super);

    function RemoteSeat(url, opts) {
      this.url = url;
      this.opts = opts;
      this.opts || (this.opts = {});
      if (this.opts.debug) {
        this.debug = true;
      }
      this.timeout = this.opts.timeout || 1000;
      this.setupTimeout = this.opts.setupTimeout || 10000;
    }

    RemoteSeat.prototype.setup = function(url, callback) {
      var _this = this;
      return request.get({
        url: url,
        json: true,
        timeout: this.setupTimeout
      }, function(e, r, response) {
        if (e || r.statusCode !== 200) {
          console.log(e, r.statusCode);
          callback(e || ("Returned " + r.statusCode));
          return false;
        }
        _this.info = response.info;
        _this.name = _this.info.name || ("Unnamed - " + url);
        callback(null);
        return _this.emit('ready');
      });
    };

    RemoteSeat.prototype.update = function(game, callback) {
      var result;
      result = 0;
      return request.post({
        url: this.url,
        body: game,
        json: true,
        timeout: this.timeout
      }, function(e, r, response) {
        if (e || r.statusCode !== 200) {
          console.log(e, response);
          return callback(e, 0);
        } else {
          return callback(null, response.bet);
        }
      });
    };

    return RemoteSeat;

  })(Seat);

  exports.create = function(url, opts, callback) {
    var bot;
    if (arguments.length === 2) {
      callback = arguments[arguments.length - 1];
      opts = {};
    }
    bot = new RemoteSeat(url, opts);
    if (bot.debug) {
      console.log("Creating bot for - " + url);
    }
    bot.setup(url, function(err) {
      return typeof callback === "function" ? callback(err, bot) : void 0;
    });
    return bot;
  };

}).call(this);
