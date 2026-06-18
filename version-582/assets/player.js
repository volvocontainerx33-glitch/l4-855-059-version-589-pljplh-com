(function () {
  function bindPlayer(shell) {
    var video = shell.querySelector('video');
    var cover = shell.querySelector('.player-cover');
    var src = shell.getAttribute('data-hls');
    var loaded = false;

    function loadAndPlay() {
      if (!video || !src) {
        return;
      }

      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
        loaded = true;
      }

      if (cover) {
        cover.classList.add('is-hidden');
      }

      video.setAttribute('controls', 'controls');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', loadAndPlay);
    }

    if (video) {
      video.addEventListener('click', loadAndPlay);
    }
  }

  document.querySelectorAll('.player-shell').forEach(bindPlayer);
})();
