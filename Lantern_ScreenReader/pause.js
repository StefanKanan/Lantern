(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Generated by CoffeeScript 2.3.2
(function() {
  var pause, play, script;

  script = document.getElementById('mediaFunctions');

  play = document.getElementById('playMedia');

  if ((play != null) && (script != null)) {
    pause = document.createElement('script');
    pause.text = 'media.pause()';
    play.parentNode.removeChild(play);
    document.body.appendChild(pause);
    document.body.removeChild(pause);
    script.parentNode.removeChild(script);
  }

}).call(this);



},{}]},{},[1]);