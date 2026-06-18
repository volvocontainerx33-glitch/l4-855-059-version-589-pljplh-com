(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-overlay');
    var stream = video ? video.getAttribute('data-stream') : '';
    var hls = null;
    var loaded = false;

    function load() {
      if (!video || !stream || loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      if (!video) {
        return;
      }
      load();
      if (button) {
        button.classList.add('is-hidden');
      }
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
      video.addEventListener('ended', function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(setupPlayer);
  });
})();
