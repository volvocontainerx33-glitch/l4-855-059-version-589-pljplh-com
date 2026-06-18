(function () {
  var button = document.querySelector('[data-menu-button]');
  var nav = document.querySelector('[data-mobile-nav]');
  if (button && nav) {
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        restart();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });

    restart();
  }

  var panel = document.querySelector('[data-filter-panel]');
  if (panel) {
    var input = panel.querySelector('[data-filter-input]');
    var type = panel.querySelector('[data-filter-type]');
    var category = panel.querySelector('[data-filter-category]');
    var year = panel.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (input && query) {
      input.value = query;
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function apply() {
      var q = normalize(input ? input.value : '');
      var t = type ? type.value : '';
      var c = category ? category.value : '';
      var y = year ? year.value : '';

      cards.forEach(function (card) {
        var ok = true;
        if (q && normalize(card.dataset.search).indexOf(q) === -1) {
          ok = false;
        }
        if (t && card.dataset.type !== t) {
          ok = false;
        }
        if (c && card.dataset.category !== c) {
          ok = false;
        }
        if (y && card.dataset.year !== y) {
          ok = false;
        }
        card.hidden = !ok;
      });
    }

    [input, type, category, year].forEach(function (el) {
      if (el) {
        el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', apply);
      }
    });

    apply();
  }
})();
