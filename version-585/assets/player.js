function mountPlayer(box) {
    var video = box.querySelector("video");
    var overlay = box.querySelector(".player-overlay");
    var source = box.getAttribute("data-src");
    var Hls = window.Hls;
    var loaded = false;

    if (!video || !overlay || !source) {
        return;
    }

    function loadSource() {
        if (loaded) {
            return;
        }
        loaded = true;
        video.controls = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return;
        }

        if (Hls && Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            return;
        }

        video.src = source;
    }

    function startPlayback() {
        loadSource();
        overlay.classList.add("is-hidden");
        var playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
            playResult.catch(function () {
                overlay.classList.remove("is-hidden");
            });
        }
    }

    overlay.addEventListener("click", startPlayback);
    video.addEventListener("click", function () {
        if (!loaded) {
            startPlayback();
        }
    });
}

document.querySelectorAll(".player-card").forEach(mountPlayer);
