(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        document.querySelectorAll(".hero-carousel").forEach(function (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
            var index = 0;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === index);
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    show(dotIndex);
                });
            });

            show(0);
            window.setInterval(function () {
                show(index + 1);
            }, 5200);
        });

        document.querySelectorAll("[data-search-scope]").forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-search]"));

            if (!input || !cards.length) {
                return;
            }

            input.addEventListener("input", function () {
                var value = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var haystack = card.getAttribute("data-search") || "";
                    card.classList.toggle("hidden-by-search", value && haystack.indexOf(value) === -1);
                });
            });
        });
    });
})();
