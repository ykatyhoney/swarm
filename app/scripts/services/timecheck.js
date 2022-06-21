/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
'use strict';

// Thu, 02 Oct 2014 07:34:29 GMT
angular.module('swarmApp').value('timecheckerServerFormat', 'ddd, DD MMM YYYY HH:mm:ss');

/**
 * @ngdoc service
 * @name swarmApp.timecheck
 * @description
 * # timecheck
 * Factory in the swarmApp.
 *
 * Players can cheat by messing with their system clock. This is ultimately
 * unavoidable, but we can make it a little harder by asking the internet
 * what time it really is. This will fail sometimes, and that's okay - we
 * don't have to be 100% secure. It's better to reset only when we're sure
 * than to nuke someone innocent.
*/
angular.module('swarmApp').factory('TimeChecker', function($rootScope, $http, $q, timecheckUrl, game, timecheckerServerFormat, $log) { let TimeChecker;
return TimeChecker = class TimeChecker {
  constructor(thresholdHours) {
    this.threshold = moment.duration(thresholdHours, 'hours');
  }

  fetchNetTime() {
    // returns a promise
    //$http.head timecheckUrl
    return $http.get(timecheckUrl);
  }

  // 'invalid' vs 'valid' is deliberate: false means it might be valid or
  // there might have been an error while checking, while true means we're
  // pretty sure they're cheating
  isNetTimeInvalid() {
    return this.fetchNetTime().then(
      res => {
        //@_isNetTimeInvalid res.date
        const ret = this._isNetTimeInvalid(res.headers().date);
        $rootScope.$emit('timecheck', res);
        return ret;
      },
      res => {
        $log.debug('fetchnettime promise failed', res);
        $rootScope.$emit('timecheckError', {error:'fetchNetTime promise failed', res});
        return $q.reject(res);
      });
  }

  _parseDate(netnowString) {
    // moment says 3-letter timezones are deprecated and we don't need enough precision to care about timezone, so hack it off
    netnowString = netnowString.replace(/\ [A-Za-z]+$/, '');
    return moment(netnowString, timecheckerServerFormat, true);
  }

  _isNetTimeInvalid(netnowString, now) {
    let netnow;
    if (now == null) { now = moment(); }
    if ((netnowString == null)) {
      $rootScope.$emit('timecheckError', {error:"netnowString is required (network failure?)"});
      return null;
    }
    try {
      netnow = this._parseDate(netnowString);
    } catch (e) {
      $rootScope.$emit('timecheckError', {error:`_parseDate exception: ${e}`});
      return null;
    }
    if (!netnow.isValid()) {
      $rootScope.$emit('timecheckError', {error:`couldn\'t parse date: ${netnowString}`});
      return null;
    }
    const diff = now.diff(netnow, 'hours');
    return Math.abs(diff) > this.threshold.as('hours');
  }

  enforceNetTime() {
    return this.isNetTimeInvalid().then(
      invalid => {
        if (invalid) {
          // they're cheating, no errors
          $rootScope.$emit('timecheckFailed');
        }
          //game.reset() # not confident enough to do this yet, but we can disable the ui until analytics tells us more.
        return invalid;
      },
      () => {}
    );
  }
};
 });
  
//angular.module('swarmApp').value 'timecheckUrl', 'http://json-time.appspot.com/time.json?callback=JSON_CALLBACK'
//angular.module('swarmApp').value 'timecheckUrl', '/'
// let's hack an autoupdater on to this
angular.module('swarmApp').value('timecheckUrl', './version.json');
// Threshold at which a player is assumed to be timewarp-cheating
angular.module('swarmApp').value('timecheckThresholdHours', 24 * 4);

angular.module('swarmApp').factory('timecheck', (TimeChecker, timecheckThresholdHours) => new TimeChecker(timecheckThresholdHours));

angular.module('swarmApp').factory('VersionChecker', function(env, util, $log) { let VersionChecker;
return VersionChecker = class VersionChecker {
  constructor(version) {
    // max version in any one chunk
    this.version = version;
    this._MAX = 100000;
  }
  check(remote) {
    if (this.compare(this.version, remote) < 0) { //local < remote
      $log.debug('newer version found on server! reloading.', {local:this.version, remote});
      // 30 second wait before reload. Extra failsafe against the
      // almost-disastrous reload-before-updating-service-worker bug of
      // v1.1.1.
      return window.setTimeout((() => window.location.reload()), 30 * 1000);
    }
  }
  compare(a, b) {
    return this.normalize(a) - this.normalize(b);
  }
  normalize(version) {
    let sum = 0;
    const chunks = version.split('.');
    chunks.reverse();
    for (let index = 0; index < chunks.length; index++) {
      let chunk = chunks[index];
      chunk = parseInt(chunk);
      util.assert((!_.isNaN(chunk)), 'version compare failed, a chunk isNaN', chunk, version);
      util.assert((chunk < this._MAX), 'version compare failed, a chunk is too big', chunk, version);
      sum += chunk * Math.pow(this._MAX, index);
    }
    return sum;
  }
};
 });

angular.module('swarmApp').factory('versioncheck', function($rootScope, VersionChecker, version, $log) {
  const ret = new VersionChecker(version);
  $rootScope.$on('timecheck', function(event, res) {
    const remote = __guard__(res != null ? res.data : undefined, x => x.version);
    $log.debug('version check', {local:version, remote});
    if (remote) {
      return ret.check(remote);
    }
  });
  return ret;
});
      

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}