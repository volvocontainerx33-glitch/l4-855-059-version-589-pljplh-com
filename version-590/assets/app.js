(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function setupNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupCardFilters() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-card-filter]"));
        inputs.forEach(function (input) {
            var scope = input.closest("[data-filter-scope]") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
            input.addEventListener("input", function () {
                var q = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-genre") || ""
                    ].join(" ").toLowerCase();
                    card.style.display = text.indexOf(q) === -1 ? "none" : "";
                });
            });
        });
    }

    function createResultCard(movie) {
        var article = document.createElement("article");
        article.className = "movie-card";
        article.innerHTML = [
            '<a class="poster-link" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">',
            '<img src="' + movie.poster + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="poster-mask"></span>',
            '<span class="poster-play">▶</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<div class="movie-meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
            '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
            '<p>' + escapeHtml(movie.description) + '</p>',
            '<div class="tag-row"><span>' + escapeHtml(movie.category) + '</span></div>',
            '</div>'
        ].join("");
        return article;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function setupSearchPage() {
        var input = document.querySelector("[data-search-input]");
        var results = document.querySelector("[data-search-results]");
        if (!input || !results || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        input.value = initial;

        function render() {
            var q = input.value.trim().toLowerCase();
            results.innerHTML = "";
            if (!q) {
                results.innerHTML = '<div class="empty-state">输入片名、地区、年份或题材即可查找影片</div>';
                return;
            }
            var matched = window.SEARCH_MOVIES.filter(function (movie) {
                return [movie.title, movie.year, movie.region, movie.category, movie.description].join(" ").toLowerCase().indexOf(q) !== -1;
            }).slice(0, 80);
            if (!matched.length) {
                results.innerHTML = '<div class="empty-state">没有找到匹配影片</div>';
                return;
            }
            matched.forEach(function (movie) {
                results.appendChild(createResultCard(movie));
            });
        }

        input.addEventListener("input", render);
        render();
    }

    ready(function () {
        setupNavigation();
        setupHero();
        setupCardFilters();
        setupSearchPage();
    });
})();
