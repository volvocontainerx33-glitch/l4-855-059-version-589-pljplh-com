(function () {
    window.initMoviePlayer = function (config) {
        var video = document.getElementById(config.videoId);
        var button = document.getElementById(config.buttonId);
        var hls = null;

        if (!video || !button || !config.source) {
            return;
        }

        function attach() {
            if (video.getAttribute("data-ready") === "1") {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = config.source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(config.source);
                hls.attachMedia(video);
            } else {
                video.src = config.source;
            }
            video.setAttribute("data-ready", "1");
        }

        function play() {
            attach();
            button.classList.add("is-hidden");
            video.setAttribute("controls", "controls");
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.getAttribute("data-ready") !== "1") {
                play();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
