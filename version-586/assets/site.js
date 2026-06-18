(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
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
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var input = document.querySelector('[data-filter-input]');
  var selects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

  function normalize(text) {
    return String(text || '').toLowerCase().trim();
  }

  function applyFilters() {
    var query = normalize(input ? input.value : '');
    var filters = {};

    selects.forEach(function (select) {
      filters[select.getAttribute('data-filter-select')] = normalize(select.value);
    });

    cards.forEach(function (card) {
      var haystack = normalize(card.textContent + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags'));
      var matchQuery = !query || haystack.indexOf(query) !== -1;
      var matchRegion = !filters.region || normalize(card.getAttribute('data-region')) === filters.region;
      var matchType = !filters.type || normalize(card.getAttribute('data-type')) === filters.type;
      var matchYear = !filters.year || normalize(card.getAttribute('data-year')) === filters.year;
      card.classList.toggle('hidden-card', !(matchQuery && matchRegion && matchType && matchYear));
    });
  }

  if (input || selects.length) {
    if (input) {
      input.addEventListener('input', applyFilters);
    }
    selects.forEach(function (select) {
      select.addEventListener('change', applyFilters);
    });
  }
})();
