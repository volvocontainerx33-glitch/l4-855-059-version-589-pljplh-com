(function () {
  function start(frame) {
    var video = frame.querySelector("video");
    var stream = frame.getAttribute("data-stream");
    if (!video || !stream) {
      return;
    }
    if (!video.getAttribute("data-ready")) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        frame.hlsInstance = hls;
      } else {
        video.src = stream;
      }
      video.setAttribute("data-ready", "1");
      video.load();
    }
    frame.classList.add("is-playing");
    var playAction = video.play();
    if (playAction && playAction.catch) {
      playAction.catch(function () {});
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.slice.call(document.querySelectorAll(".video-frame")).forEach(function (frame) {
      var overlay = frame.querySelector(".play-overlay");
      var video = frame.querySelector("video");
      if (overlay) {
        overlay.addEventListener("click", function () {
          start(frame);
        });
      }
      if (video) {
        video.addEventListener("click", function () {
          if (!video.getAttribute("data-ready")) {
            start(frame);
          }
        });
      }
    });
  });
}());
