(function () {
  'use strict';

  const video = document.getElementById('hero-video');
  const status = document.getElementById('motion-status');
  const startButton = document.getElementById('video-start');
  const menuDialog = document.getElementById('site-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const phone = window.matchMedia('(max-width:700px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  const backupBase = 'https://cdn.jsdelivr.net/gh/guldanjaMAX/tracy-allyn-preview@3ceafd3456cd3be5201ab9ec8d396a1f71ff2e09/assets/videos/';

  let wantsMotion = !reduceMotion.matches;
  let inView = !('IntersectionObserver' in window);
  let source = '';
  let usingBackup = false;
  let blocked = false;
  let failed = false;
  let hasPlayed = false;
  let generation = 0;
  let pending = false;
  let waitTimer;
  const variant = () => phone.matches ? 'mobile' : 'desktop';
  const visible = () => inView && !document.hidden && wantsMotion;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  function showButton(message) {
    startButton.hidden = false;
    status.textContent = message;
  }

  function play() {
    if (!visible() || pending || blocked || failed || !video.paused) return;
    const attempt = generation;
    pending = true;
    video.play().then(() => {
      if (attempt === generation) pending = false;
    }, error => {
      if (attempt !== generation) return;
      pending = false;
      if (error.name === 'AbortError' || !visible()) return;
      if (error.name === 'NotSupportedError') {
        recover();
        return;
      }
      blocked = true;
      clearTimeout(waitTimer);
      showButton('Select Play video to start the background video.');
    });
  }

  function bufferedEnd() {
    return video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
  }

  function watchWait() {
    clearTimeout(waitTimer);
    if (!visible() || blocked || failed || !source) return;
    const attempt = generation;
    const before = bufferedEnd();
    const position = video.currentTime;
    waitTimer = setTimeout(() => {
      if (attempt !== generation || !visible() || blocked || failed) return;
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA || video.currentTime !== position) return;
      // Give a progressing first load time to buffer. A frozen request or a
      // sustained mid-play stall gets one independent, smaller CDN rendition.
      if (!hasPlayed && bufferedEnd() > before + 0.05) watchWait();
      else if (!usingBackup) load(true);
      else showButton('Select Play video to retry the background video.');
    }, hasPlayed ? 8000 : 12000);
  }

  function load(backup) {
    generation++;
    pending = false;
    failed = false;
    blocked = false;
    hasPlayed = false;
    usingBackup = backup;
    startButton.hidden = true;
    clearTimeout(waitTimer);
    source = backup ? backupBase + 'tracy-hero-' + variant() + '-v2.mp4'
                    : 'assets/videos/tracy-hero-' + variant() + '-1080-v1.mp4';
    video.classList.remove('is-visible');
    video.preload = 'auto';
    video.src = source;
    video.load();
    status.textContent = 'Loading background video.';
    play();
    watchWait();
  }

  function recover() {
    if (failed || !source) return;
    if (!usingBackup && visible()) {
      load(true);
      return;
    }
    failed = true;
    clearTimeout(waitTimer);
    video.classList.remove('is-visible');
    showButton('The video could not load. Select Play video to try again.');
  }

  function sync() {
    if (!visible()) {
      clearTimeout(waitTimer);
      pending = false;
      video.pause();
      if (!wantsMotion) {
        video.classList.remove('is-visible');
        showButton('Reduced motion is enabled. Select Play video if you would like motion.');
      }
      return;
    }
    if (!source) load(false);
    else if (failed && !usingBackup) load(true);
    else {
      play();
      if (!hasPlayed || video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) watchWait();
    }
  }

  startButton.addEventListener('click', () => {
    wantsMotion = true;
    blocked = false;
    if (failed || !source) load(false);
    else if (video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA && !pending) load(usingBackup);
    else play();
  });
  video.addEventListener('playing', () => {
    if (!visible()) {
      video.pause();
      return;
    }
    hasPlayed = true;
    pending = false;
    blocked = false;
    clearTimeout(waitTimer);
    startButton.hidden = true;
    video.classList.add('is-visible');
    status.textContent = 'Background video playing.';
  });
  video.addEventListener('canplay', play);
  video.addEventListener('error', recover);
  video.addEventListener('waiting', watchWait);
  video.addEventListener('stalled', watchWait);

  function resetSource() {
    generation++;
    clearTimeout(waitTimer);
    video.pause();
    video.classList.remove('is-visible');
    if (source) {
      video.removeAttribute('src');
      video.load();
    }
    source = '';
    sync();
  }
  function onQueryChange(query, listener) {
    if (query.addEventListener) query.addEventListener('change', listener);
    else query.addListener(listener);
  }
  onQueryChange(phone, resetSource);
  onQueryChange(reduceMotion, event => {
    wantsMotion = !event.matches;
    blocked = false;
    sync();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      sync();
    });
    observer.observe(video);
  }

  menuToggle.addEventListener('click', () => {
    menuDialog.showModal();
    menuToggle.setAttribute('aria-expanded','true');
    document.documentElement.classList.add('menu-open');
  });
  document.getElementById('menu-close').addEventListener('click', () => menuDialog.close());
  menuDialog.addEventListener('close', () => {
    menuToggle.setAttribute('aria-expanded','false');
    document.documentElement.classList.remove('menu-open');
    menuToggle.focus();
    sync();
  });
  menuDialog.addEventListener('click', event => {
    if (event.target !== menuDialog) return;
    const box = menuDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) menuDialog.close();
  });
  menuDialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuDialog.close();
    if (link.hasAttribute('data-menu-home')) requestAnimationFrame(() => document.getElementById('main-copy').focus());
  }));
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pageshow', sync);
  sync();
})();
