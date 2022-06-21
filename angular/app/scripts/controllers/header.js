/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
'use strict';

/**
 * @ngdoc function
 * @name swarmApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the swarmApp
*/
angular.module('swarmApp').controller('HeaderCtrl', function($scope, $window, env, version, session, timecheck, $http, $interval, $log, $location,
kongregateScrolling, pageTheme, remoteSaveInit, touchTooltipInit,
// analytics/statistics not actually used, just want them to init
versioncheck, analytics, statistics, achievementslistener, favico
) {
  let enforce;
  $scope.env = env;
  $scope.version = version;
  $scope.session = session;

  const intervalMillis = 1000 * 60 * 30;
  //# Service worker update-checks are broken.
  //if 'serviceWorker' in navigator
  //  $log.debug 'service workers supported, using them for update-checks'
  //  # this should match the path in index.html
  //  navigator.servceWorker.register('/service-worker.js').then registration ->
  //    registration.addEventListener 'onupdatefound', ->
  //      $log.debug 'sw: update found'
  //      installer = registration.installing
  //      installer.addEventListener 'onstatechange', ->
  //        if installer.state == 'installed'
  //          $log.debug 'sw: update installed'
  //          # 30 second wait before reload. Extra failsafe against the
  //          # almost-disastrous reload-before-updating-service-worker bug of
  //          # v1.1.1. This shouldn't be necessary to avoid that (this time we wait to load service-worker.js above), but it makes me feel better.
  //          window.setTimeout((-> window.location.reload()), 30 * 1000)
  //    $interval (-> registration.update()), intervalMillis
  //    registration.update()
  //else
  // This isn't anti-cheat anymore. Instead, it's legacy version-updates.
  (enforce = () => timecheck.enforceNetTime().then(
    function(invalid) {
      $log.debug('net time check successful', invalid);
      return $scope.netTimeInvalid = invalid;
    },
      // We're no longer enforcing this.
      //if invalid
      //  $log.debug 'cheater', invalid
      //  # Replacing ng-view (via .viewwrap) disables navigation to other pages.
      //  # This is hideous technique and you, reader, should not copy it.
      //  $('.viewwrap').before '<div><p class="cheater">There is a problem with your system clock.</p><p>If you don\'t know why you\'re seeing this, <a target="_blank" href=\"http://www.reddit.com/r/swarmsim\">ask about it here</a>.</p></div>'
      //  $('.viewwrap').css({display:'none'})
      //  $('.footer').css({display:'none'})
      //  $interval.cancel enforceInterval
    () => $log.warn('failed to check net time')))();
  const enforceInterval = $interval(enforce, intervalMillis);

  $scope.konami = new Konami(function() {
    $scope.$emit('konami');
    return $log.debug('konami');
  });

  kongregateScrolling($scope);
  pageTheme($scope);
  remoteSaveInit($scope);
  return touchTooltipInit($scope);
});

angular.module('swarmApp').factory('pageTheme', ($log, options) => (function($scope) {
  $scope.options = options;
  const themeEl = options.constructor.THEME_EL;
  $scope.$watch('options.theme()', (theme, oldval) => {
    // based on https://stackoverflow.com/questions/19192747/how-to-dynamically-change-themes-after-clicking-a-drop-down-menu-of-themes
    if (theme.url !== themeEl.attr('href')) {
      themeEl.attr('href', theme.url);
    }
    const body = $('body');
    if (oldval != null) {
      body.removeClass(`theme-${oldval.name}`);
    }
    return body.addClass(`theme-${theme.name}`);
  });
  return $scope.$watch('options.themeExtra()', (css, oldval) => {
    if ((css != null) || (oldval != null)) {
      if (($scope.themeExtraEl == null)) {
        $scope.themeExtraEl = $('<style type="text/css"></style>');
        $scope.themeExtraEl.appendTo('body');
      }
      $scope.themeExtraEl.html(css);
      return $log.debug('extratheming', $scope.themeExtraEl, css);
    }
  });
}));

angular.module('swarmApp').factory('kongregateScrolling', ($log, kongregate, options) => (function($scope) {
  $scope.options = options;
  if (!kongregate.isKongregate()) {
    return;
  }
  $scope.$watch('options.scrolling()', (newval, oldval) => {
    if (newval !== oldval) {
      options.isScrollingChangedSincePageLoad = true;
      if (oldval === 'resize') {
        options.isScrollingChangedFromResizeSincePageLoad = true;
      }
    }
    return kongregate.onScrollOptionChange(!options.isScrollingChangedSincePageLoad, oldval);
  });
  $scope.$watch('options.iframeMinX()', (newval, oldval) => {
    if (newval !== oldval) {
      $log.debug('onchange resize x', newval, oldval);
      return kongregate._resizeGame();
    }
  });
  $scope.$watch('options.iframeMinY()', (newval, oldval) => {
    if (newval !== oldval) {
      $log.debug('onchange resize y', newval, oldval);
      return kongregate._resizeGame();
    }
  });
  kongregate.onScrollOptionChange(!options.isScrollingChangedSincePageLoad);
  kongregate.onLoad.then(function() {
    if ((options.iframeMinX() !== options.constructor.IFRAME_X_MIN) || (options.iframeMinY() !== options.constructor.IFRAME_Y_MIN)) {
      $log.debug('onload resize', options.iframeMinX(), options.iframeMinY());
      return kongregate._resizeGame();
    }
  });
  return $scope.onRender = () => kongregate.onResize();
}));

angular.module('swarmApp').factory('remoteSaveInit', ($log, kongregate, kongregatePlayfabSyncer, wwwPlayfabSyncer, options) => $scope => $scope.$watch('options.autopush()', (newval, oldval) => {
  return [kongregatePlayfabSyncer, wwwPlayfabSyncer].map((syncer) => (syncer => {
    $log.debug('autopush trying to setup', syncer.constructor.name);
    if (syncer.isVisible() || (typeof syncer.isActive === 'function' ? syncer.isActive() : undefined)) {
      $log.debug('autopush visible', syncer.constructor.name);
      if (syncer.isInit()) {
        $log.debug('autopush setup', syncer.constructor.name);
        return syncer.initAutopush(newval);
      } else {
        $log.debug('autopush not yet init', syncer.constructor.name);
        return syncer.init(function() {
          $log.debug('autopush init done, checking success', syncer.constructor.name);
          if (syncer.isInit()) {
            $log.debug('autopush setup', syncer.constructor.name);
            return syncer.initAutopush(newval);
          }
        });
      }
    }
  })(syncer));
}));

angular.module('swarmApp').factory('touchTooltipInit', ($log, $location, $timeout) => (function($scope) {
  // Show tooltips for touch-devices where the user's actually using touch.
  const body = $('body');
  const doc = $(window.document);
  let setupEvents = 'touchstart touchmove touchend touchcancel';
  //runEvents = 'touchstart touchmove touchend'
  if ($location.search().mousetouch) {
    setupEvents += ' mousedown mouseup';
  }
    //runEvents += ' mousedown mouseup'

  var setupTouch = function() {
    $log.debug('touch event detected, setting up tooltip-on-touch');
    doc.off(setupEvents, setupTouch);
    const selector = '[title]';
    return body.tooltip({
      selector,
      trigger: 'click'
    });
  };
      // I give up. Trigger it for clicks too *after* any touch event happens
      //trigger: 'manual'
    //openTooltips = []
    //openTimer = []
    //body.on runEvents, selector, ->
    //  el = $(this)
    //  el.tooltip 'show'
    //  alreadyOpen = false
    //  for open in openTooltips
    //    if open != el
    //      open.tooltip 'hide'
    //    else
    //      alreadyOpen = true
    //  for timer in openTimer
    //    $timeout.cancel timer
    //  if not alreadyOpen
    //    openTooltips.push el
    //  openTimer.push $timeout (-> el.tooltip 'hide'), 5000
  doc.on(setupEvents, setupTouch);
  return $log.debug('adding setupTouch hook');
}));
  //if document.documentElement.onTouchStart? # IE has this even for non-touchscreens. also fails for touch-and-mouse devices where user isn't actually touching
  //  placement: 'bottom'
  //container: 'body'
  //  animation: false # unfortunate, but the fade + reposition below is awkward
  //.on 'click', selector, (event) ->
  //  console.log 'tooltipclickevent', event, position:'absolute',left:event.clientX, top:event.clientY, $('.tooltip.top')
  //  el = $('.tooltip.top')
  //  el.css left:event.clientX - el.width()/2, top:event.clientY + el.height()
