import { H as Hls } from './hls-vendor-dru42stk.js';

function initPlayers() {
  var videos = Array.prototype.slice.call(document.querySelectorAll('video[data-hls-source]'));
  videos.forEach(function (video) {
    var source = video.getAttribute('data-hls-source');
    var shell = video.closest('[data-player-shell]');
    var button = shell ? shell.querySelector('[data-player-button]') : null;
    var hls = null;

    if (!source) {
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (_, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    }

    function playVideo() {
      if (button) {
        button.classList.add('is-hidden');
      }
      video.play().catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initPlayers);
