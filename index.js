#! /usr/bin/env node
var shelljs = require('shelljs');
var argv = require('yargs').argv;
var cfg = require('rc')('bluestreak', {
  start: 'catalina start',
  stop: 'catalina stop',
  maven: {
    skipTests: true
  }
});

var bluestreak = {
  _exec: function (cmd) {
    var promise = new Promise(function (resolve, reject) {
      var child = shelljs.exec(cmd, { async: true, silent: true });
      child.stdout.on('data', function (data) {
        console.log(data.toString());
      });
      child.stderr.on('data', function (data) {
        console.log(data.toString());
      });
      child.on('close', function (code) {
        resolve(code);
      });
    });

    return promise;
  },
  stop: function () {
    return this._exec(cfg.stop);
  },
  deploy: function () {
    var mvn = require('maven').create({
      profiles: ['blue-streak']
    });
    return mvn.execute(['clean', 'install'], cfg.maven);
  },
  start: function () {
    return this._exec(cfg.start);
  }
};

(function (bs) {
  var tasks = argv._;

  if (!tasks.length) {
    tasks = ['start'];
  }

  var executeTasks = function () {
    var promise = bs[this[0]]();
    this.splice(0, 1);
    if (this.length) {
      promise.then(executeTasks.bind(this));
    } else {
      promise.then(function () {
        process.exit(0);
      })
    }
  };

  executeTasks.apply(tasks);
})(bluestreak);
