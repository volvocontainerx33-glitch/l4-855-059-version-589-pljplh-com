import { H as Hls } from './hls-vendor.js';

(function () {
  var frame = document.querySelector('[data-player]');
  var video = document.getElementById('moviePlayer');
  var button = document.querySelector('[data-play-button]');
  var configElement = document.getElementById('moviePlayback');

  if (!frame || !video || !button || !configElement) {
    return;
  }

  var config = {};

  try {
    config = JSON.parse(configElement.textContent || '{}');
  } catch (error) {
    config = {};
  }

  var source = config.src;
  var prepared = false;
  var hls = null;

  function prepare() {
    if (prepared || !source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    prepared = true;
  }

  function start() {
    prepare();
    button.classList.add('is-hidden');
    var attempt = video.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        button.classList.remove('is-hidden');
      });
    }
  }

  button.addEventListener('click', start);

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });

  video.addEventListener('pause', function () {
    if (!video.ended) {
      button.classList.remove('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
})();
