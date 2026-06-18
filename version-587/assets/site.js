(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    if (slides.length === 0) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var scope = panel.closest('main') || document;
      var input = panel.querySelector('[data-movie-search]');
      var year = panel.querySelector('[data-filter-year]');
      var region = panel.querySelector('[data-filter-region]');
      var type = panel.querySelector('[data-filter-type]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      var empty = scope.querySelector('[data-empty-message]');

      function value(element) {
        return element ? element.value.trim().toLowerCase() : '';
      }

      function apply() {
        var keyword = value(input);
        var selectedYear = value(year);
        var selectedRegion = value(region);
        var selectedType = value(type);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year')
          ].join(' ').toLowerCase();
          var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchesYear = !selectedYear || (card.getAttribute('data-year') || '').toLowerCase().indexOf(selectedYear) !== -1;
          var matchesRegion = !selectedRegion || (card.getAttribute('data-region') || '').toLowerCase().indexOf(selectedRegion) !== -1;
          var matchesType = !selectedType || (card.getAttribute('data-type') || '').toLowerCase().indexOf(selectedType) !== -1;
          var showCard = matchesKeyword && matchesYear && matchesRegion && matchesType;
          card.classList.toggle('is-hidden', !showCard);
          if (showCard) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [input, year, region, type].forEach(function (element) {
        if (element) {
          element.addEventListener('input', apply);
          element.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
