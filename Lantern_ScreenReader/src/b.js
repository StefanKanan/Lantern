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

//# sourceMappingURL=b.js.map