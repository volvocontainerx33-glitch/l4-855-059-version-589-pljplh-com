(function () {
  function selectAll(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  function initMobileMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function markMissingImages() {
    selectAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing');
      });
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initCategoryFilters() {
    var panel = document.querySelector('[data-filter-panel]');
    var grid = document.querySelector('[data-filter-grid]');
    if (!panel || !grid) {
      return;
    }
    var keywordInput = panel.querySelector('[data-filter-keyword]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var resetButton = panel.querySelector('[data-filter-reset]');
    var emptyMessage = document.querySelector('[data-empty-message]');
    var cards = selectAll('[data-movie-card]', grid);

    function apply() {
      var keyword = (keywordInput && keywordInput.value || '').trim().toLowerCase();
      var type = typeSelect && typeSelect.value || '';
      var year = yearSelect && yearSelect.value || '';
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        var matched = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (type && card.getAttribute('data-type') !== type) {
          matched = false;
        }
        if (year && card.getAttribute('data-year') !== year) {
          matched = false;
        }
        card.hidden = !matched;
        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
      }
    }

    [keywordInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (keywordInput) keywordInput.value = '';
        if (typeSelect) typeSelect.value = '';
        if (yearSelect) yearSelect.value = '';
        apply();
      });
    }
  }

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '' +
      '<a class="movie-card" href="' + escapeHtml(movie.url) + '" data-movie-card>' +
        '<figure class="poster-wrap">' +
          '<span class="poster-fallback">' + escapeHtml(movie.title) + '</span>' +
          '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
          '<figcaption class="poster-overlay"><span class="play-dot">▶</span><span>立即点播</span></figcaption>' +
        '</figure>' +
        '<div class="card-body">' +
          '<div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
          '<h3>' + escapeHtml(movie.title) + '</h3>' +
          '<p>' + escapeHtml(movie.oneLine || '') + '</p>' +
          '<div class="tag-row">' + tags + '</div>' +
        '</div>' +
      '</a>';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initSearchPage() {
    var results = document.querySelector('[data-search-results]');
    var input = document.querySelector('[data-search-input]');
    var form = document.querySelector('[data-search-form]');
    var title = document.querySelector('[data-search-title]');
    var count = document.querySelector('[data-search-count]');
    var data = window.MOVIE_SEARCH_DATA || [];
    if (!results || !data.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    if (input) {
      input.value = initialQuery;
    }

    function search(query) {
      var keyword = query.trim().toLowerCase();
      var matches = data;
      if (keyword) {
        matches = data.filter(function (movie) {
          var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, (movie.tags || []).join(' '), movie.oneLine]
            .join(' ')
            .toLowerCase();
          return haystack.indexOf(keyword) !== -1;
        });
      } else {
        matches = data.slice(0, 24);
      }

      results.innerHTML = matches.slice(0, 200).map(cardTemplate).join('');
      markMissingImages();
      if (title) {
        title.textContent = keyword ? '搜索结果' : '推荐浏览';
      }
      if (count) {
        count.textContent = keyword ? '关键词“' + query + '”找到 ' + matches.length + ' 部影片，当前展示前 200 部。' : '未输入关键词时展示前 24 部影片。';
      }
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var query = input ? input.value : '';
        var nextUrl = window.location.pathname + (query.trim() ? '?q=' + encodeURIComponent(query.trim()) : '');
        window.history.replaceState(null, '', nextUrl);
        search(query);
      });
    }

    if (input) {
      input.addEventListener('input', function () {
        search(input.value);
      });
    }

    search(initialQuery);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    markMissingImages();
    initHero();
    initCategoryFilters();
    initSearchPage();
  });
})();
