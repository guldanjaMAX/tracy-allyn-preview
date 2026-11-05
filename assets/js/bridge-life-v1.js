(function () {
  'use strict';
  var section = document.getElementById('bridge');
  var video = document.getElementById('bridge-video');
  var button = document.getElementById('bridge-motion-toggle');
  if (!section || !video || !button) return;
  var label = button.querySelector('.hp-bridge-motion-label');
  var icon = button.querySelector('.hp-bridge-motion-icon');
  var device = window.matchMedia('(max-width: 1000px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var visible = false, userPaused = false, userEnabled = false;
  var blocked = false, failed = false, pending = false;
  var source = '', version = 0, attempt = 0;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;
  button.hidden = false;

  function motionAllowed() {
    return userEnabled || (!reduced.matches && !(connection && connection.saveData));
  }
  function eligible() {
    return visible && !document.hidden && motionAllowed() && !userPaused && !blocked && !failed;
  }
  function updateButton() {
    var playing = !video.paused || pending;
    label.textContent = playing ? 'Pause video' : 'Play video';
    icon.textContent = playing ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
  }
  function stop(hide) {
    attempt += 1;
    pending = false;
    video.autoplay = false;
    video.pause();
    if (hide) video.classList.remove('is-playing');
    updateButton();
  }
  function unload() {
    version += 1;
    stop(true);
    source = '';
    video.preload = 'none';
    video.removeAttribute('src');
    video.load();
  }
  function desiredSource() {
    return video.getAttribute(device.matches ? 'data-mobile' : 'data-desktop');
  }
  function play() {
    if (!eligible() || pending) return;
    var selected = desiredSource();
    if (!selected) return;
    if (source !== selected) {
      unload();
      source = selected;
      video.preload = 'auto';
      video.src = source;
      video.load();
    }
    if (!video.paused) return;
    var thisVersion = version, thisAttempt = ++attempt;
    pending = true;
    video.autoplay = true;
    updateButton();
    function rejected(error) {
      if (thisVersion !== version || thisAttempt !== attempt) return;
      pending = false;
      // Visibility or a source switch may abort playback without a media failure.
      if (error && error.name === 'AbortError') {
        updateButton();
        return;
      }
      blocked = true;
      stop(true);
    }
    try {
      var promise = video.play();
      if (promise && promise.then) promise.then(function () {
        if (thisVersion !== version || thisAttempt !== attempt) return;
        pending = false;
        if (!eligible()) stop(false);
        else updateButton();
      }, rejected);
      else { pending = false; updateButton(); }
    } catch (error) { rejected(error); }
  }
  function sync() {
    if (eligible()) play();
    else stop(!motionAllowed());
  }

  button.addEventListener('click', function () {
    if (!video.paused || pending) {
      userPaused = true;
      stop(false);
      return;
    }
    userPaused = false;
    userEnabled = true;
    blocked = false;
    if (failed) { failed = false; unload(); }
    play();
  });
  video.addEventListener('playing', function () {
    if (!eligible()) { stop(!motionAllowed()); return; }
    pending = false;
    blocked = false;
    video.classList.add('is-playing');
    updateButton();
  });
  video.addEventListener('pause', updateButton);
  video.addEventListener('canplay', play);
  video.addEventListener('error', function () {
    // Removing a source while changing preferences is not a failed media load.
    if (!source) return;
    failed = true;
    stop(true);
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', function () { stop(false); });
  window.addEventListener('pageshow', sync);

  function deviceChanged() {
    blocked = false;
    failed = false;
    unload();
    sync();
  }
  function preferencesChanged() {
    // A newly enabled system/data preference takes effect even after explicit play.
    userEnabled = false;
    blocked = false;
    if (!motionAllowed()) unload();
    sync();
  }
  function listen(query, callback) {
    if (query.addEventListener) query.addEventListener('change', callback);
    else if (query.addListener) query.addListener(callback);
  }
  listen(device, deviceChanged);
  listen(reduced, preferencesChanged);
  if (connection && connection.addEventListener) connection.addEventListener('change', preferencesChanged);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target !== section) return;
        visible = entry.isIntersecting && entry.intersectionRatio > 0;
        sync();
      });
    }, {threshold: [0, 0.01]});
    observer.observe(section);
  } else {
    var queued = false;
    function checkPosition() {
      queued = false;
      var box = section.getBoundingClientRect();
      visible = box.bottom > 0 && box.top < window.innerHeight;
      sync();
    }
    function schedulePositionCheck() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(checkPosition);
    }
    window.addEventListener('scroll', schedulePositionCheck, {passive: true});
    window.addEventListener('resize', schedulePositionCheck);
    checkPosition();
  }
  updateButton();
})();
