(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var navPanel = document.querySelector('[data-nav-panel]');

  if (navButton && navPanel) {
    navButton.addEventListener('click', function () {
      navPanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  });

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var input = panel.querySelector('[data-filter-input]');
    var year = panel.querySelector('[data-filter-year]');
    var type = panel.querySelector('[data-filter-type]');
    var region = panel.querySelector('[data-filter-region]');
    var grid = document.querySelector('[data-filter-grid]');
    var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('[data-card]')) : [];

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function apply() {
      var keyword = normalize(input && input.value);
      var selectedYear = year ? year.value : '';
      var selectedType = type ? type.value : '';
      var selectedRegion = region ? region.value : '';

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-tags')
        ].join(' '));
        var passKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var passYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
        var passType = !selectedType || card.getAttribute('data-type') === selectedType;
        var passRegion = !selectedRegion || card.getAttribute('data-region') === selectedRegion;
        card.style.display = passKeyword && passYear && passType && passRegion ? '' : 'none';
      });
    }

    [input, year, type, region].forEach(function (item) {
      if (item) {
        item.addEventListener('input', apply);
        item.addEventListener('change', apply);
      }
    });
  });

  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchHeading = document.querySelector('[data-search-heading]');
  var searchForm = document.querySelector('[data-search-form]');

  if (searchInput && searchResults && window.SEARCH_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function card(movie) {
      var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');

      return [
        '<article class="movie-card">',
        '  <a href="' + escapeHtml(movie.url) + '" class="movie-thumb">',
        '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="movie-badge">' + escapeHtml(movie.type) + '</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <h2><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h2>',
        '    <p>' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>',
        '    <div class="tag-row">' + tags + '</div>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function runSearch(value) {
      var query = String(value || '').trim().toLowerCase();
      if (!query) {
        return;
      }

      var result = window.SEARCH_INDEX.filter(function (movie) {
        return [movie.title, movie.oneLine, movie.year, movie.region, movie.type, movie.genre, (movie.tags || []).join(' ')]
          .join(' ')
          .toLowerCase()
          .indexOf(query) !== -1;
      }).slice(0, 120);

      if (searchHeading) {
        searchHeading.textContent = result.length ? '搜索结果' : '没有找到匹配影片';
      }

      searchResults.innerHTML = result.length
        ? result.map(card).join('')
        : '<div class="empty-state">换一个关键词继续搜索。</div>';
    }

    if (initialQuery) {
      runSearch(initialQuery);
    }

    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var value = searchInput.value.trim();
        var url = value ? './search.html?q=' + encodeURIComponent(value) : './search.html';
        history.replaceState(null, '', url);
        runSearch(value);
      });
    }
  }
})();
