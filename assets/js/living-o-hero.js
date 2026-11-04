(function(){
'use strict';
var video=document.getElementById('hero-video');
var status=document.getElementById('motion-status');
var startButton=document.getElementById('video-start');
var menuDialog=document.getElementById('site-menu');
var menuToggle=document.getElementById('menu-toggle');
var deviceQuery=window.matchMedia('(max-width:700px)');
var reducedQuery=window.matchMedia('(prefers-reduced-motion:reduce)');
var wantsMotion=!reducedQuery.matches;
var sourceVersion=0,playAttempt=0,pending=false,blocked=false,mediaFailed=false,retries=0,loadingTimer;
var sources={desktop:{film:'assets/videos/wild-and-rooted-desktop-whitened-v1.mp4',poster:'assets/videos/wild-and-rooted-desktop-whitened-v1.jpg'},phone:{film:'assets/videos/wild-and-rooted-mobile-whitened-v1.mp4',poster:'assets/videos/wild-and-rooted-mobile-whitened-v1.jpg'}};
video.muted=true;video.defaultMuted=true;video.playsInline=true;video.loop=true;
function showPoster(message){video.classList.remove('is-visible');status.textContent=message;startButton.hidden=false}
function play(){
  if(!wantsMotion||document.hidden||blocked||mediaFailed||pending||!video.paused)return;
  var version=sourceVersion,attempt=++playAttempt;
  pending=true;
  function failed(error){
    if(version!==sourceVersion||attempt!==playAttempt)return;
    pending=false;
    if(document.hidden||!wantsMotion)return;
    // A load, source change or visibility pause may interrupt a valid play request.
    if(error&&error.name==='AbortError'&&retries<2){
      retries+=1;
      setTimeout(function(){if(version===sourceVersion)play()},150);
      return;
    }
    blocked=true;
    showPoster('Select Play video to start the background video.');
  }
  try{
    var result=video.play();
    if(result&&result.then)result.then(function(){if(version===sourceVersion&&attempt===playAttempt)pending=false},failed);
    else pending=false;
  }catch(error){failed(error)}
}
function loadSource(){
  sourceVersion+=1;playAttempt+=1;pending=false;blocked=false;mediaFailed=false;retries=0;
  clearTimeout(loadingTimer);
  video.pause();video.classList.remove('is-visible');startButton.hidden=true;
  var source=deviceQuery.matches?sources.phone:sources.desktop;
  video.autoplay=wantsMotion;video.preload=wantsMotion?'auto':'none';
  video.poster=source.poster;video.src=source.film;video.load();
  if(wantsMotion){
    status.textContent='Loading background video.';
    play();
    var version=sourceVersion;
    loadingTimer=setTimeout(function(){if(version===sourceVersion&&video.paused&&!document.hidden)showPoster('Select Play video to start the background video.')},8000);
  }else showPoster('Reduced motion is enabled. Select Play video if you would like motion.');
}
startButton.addEventListener('click',function(){
  wantsMotion=true;blocked=false;pending=false;retries=0;playAttempt+=1;video.autoplay=true;video.preload='auto';
  if(mediaFailed)loadSource();else play();
});
video.addEventListener('playing',function(){
  if(!wantsMotion||document.hidden){video.pause();return}
  playAttempt+=1;pending=false;blocked=false;mediaFailed=false;retries=0;
  clearTimeout(loadingTimer);startButton.hidden=true;video.classList.add('is-visible');status.textContent='Background video playing.';
});
video.addEventListener('canplay',play);
video.addEventListener('error',function(){
  playAttempt+=1;pending=false;mediaFailed=true;clearTimeout(loadingTimer);
  showPoster('The video could not load. Select Play video to try again.');
});
menuToggle.addEventListener('click',function(){menuDialog.showModal();menuToggle.setAttribute('aria-expanded','true');document.documentElement.classList.add('menu-open')});
document.getElementById('menu-close').addEventListener('click',function(){menuDialog.close()});
menuDialog.addEventListener('close',function(){menuToggle.setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-open');menuToggle.focus();play()});
menuDialog.addEventListener('click',function(event){if(event.target===menuDialog){var box=menuDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)menuDialog.close()}});
menuDialog.querySelectorAll('a').forEach(function(link){link.addEventListener('click',function(){menuDialog.close();if(link.hasAttribute('data-menu-home'))requestAnimationFrame(function(){document.getElementById('main-copy').focus()})})});
document.addEventListener('visibilitychange',function(){
  if(document.hidden){playAttempt+=1;pending=false;video.pause()}
  else play();
});
window.addEventListener('pageshow',play);
function reducedChanged(event){
  wantsMotion=!event.matches;video.autoplay=wantsMotion;playAttempt+=1;pending=false;
  if(!wantsMotion){video.pause();showPoster('Reduced motion is enabled. Select Play video if you would like motion.')}
  else{blocked=false;mediaFailed=false;video.preload='auto';play()}
}
if(deviceQuery.addEventListener){deviceQuery.addEventListener('change',loadSource);reducedQuery.addEventListener('change',reducedChanged)}else{deviceQuery.addListener(loadSource);reducedQuery.addListener(reducedChanged)}
loadSource();
})();
