(function () {
  window.setupMoviePlayer = function (videoId, overlayId, source) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var ready = false;
    var hlsInstance = null;

    if (!video || !overlay || !source) {
      return;
    }

    function prepare() {
      if (ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }

      ready = true;
    }

    function hideOverlay() {
      overlay.classList.add('is-hidden');
      overlay.setAttribute('hidden', 'hidden');
    }

    function showOverlay() {
      overlay.classList.remove('is-hidden');
      overlay.removeAttribute('hidden');
    }

    function start() {
      prepare();
      hideOverlay();
      var playAction = video.play();

      if (playAction && typeof playAction.catch === 'function') {
        playAction.catch(function () {
          showOverlay();
        });
      }
    }

    overlay.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        start();
      }
    });
    video.addEventListener('play', hideOverlay);
    video.addEventListener('ended', showOverlay);
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
})();
