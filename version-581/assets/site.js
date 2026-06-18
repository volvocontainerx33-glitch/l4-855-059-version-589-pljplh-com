(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var menuPanel = document.querySelector('[data-menu-panel]');

    if (menuButton && menuPanel) {
        menuButton.addEventListener('click', function () {
            menuPanel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = parseInt(dot.getAttribute('data-hero-dot'), 10);
                showSlide(index);
            });
        });

        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    var yearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-year-filter]'));
    var typeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-type-filter]'));
    var activeYear = '';
    var activeType = '';

    function applyFilters() {
        var keyword = normalize(searchInputs.map(function (input) {
            return input.value;
        }).filter(Boolean).pop() || '');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.textContent
            ].join(' '));
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchYear = !activeYear || card.getAttribute('data-year') === activeYear;
            var matchType = !activeType || card.getAttribute('data-type') === activeType;
            card.classList.toggle('is-hidden', !(matchKeyword && matchYear && matchType));
        });
    }

    searchInputs.forEach(function (input) {
        input.addEventListener('input', applyFilters);
    });

    function setupFilterButtons(buttons, attr, setter) {
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (item) {
                    item.classList.remove('active');
                });
                button.classList.add('active');
                setter(button.getAttribute(attr) || '');
                applyFilters();
            });
        });
    }

    setupFilterButtons(yearButtons, 'data-year-filter', function (value) {
        activeYear = value;
    });

    setupFilterButtons(typeButtons, 'data-type-filter', function (value) {
        activeType = value;
    });

    var video = document.querySelector('.video-player');
    var playButton = document.querySelector('[data-play-button]');
    var hlsInstance = null;

    function startPlayer() {
        if (!video) {
            return;
        }
        var source = video.getAttribute('data-src');
        if (!source) {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (!video.getAttribute('src')) {
                video.setAttribute('src', source);
            }
            video.play().catch(function () {});
        } else if (window.Hls && window.Hls.isSupported()) {
            if (!hlsInstance) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
            } else {
                video.play().catch(function () {});
            }
        } else {
            video.setAttribute('src', source);
            video.play().catch(function () {});
        }
        if (playButton) {
            playButton.classList.add('is-hidden');
        }
    }

    if (playButton) {
        playButton.addEventListener('click', startPlayer);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (!video.getAttribute('src') && !hlsInstance) {
                startPlayer();
            }
        });
        video.addEventListener('play', function () {
            if (playButton) {
                playButton.classList.add('is-hidden');
            }
        });
    }
})();
