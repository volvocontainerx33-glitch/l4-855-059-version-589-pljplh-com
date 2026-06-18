(function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initMobileMenu() {
    var toggle = $(".mobile-toggle");
    var panel = $(".mobile-panel");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function initHero() {
    var slides = $all(".hero-slide");
    var dots = $all(".hero-dot");
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    function show(next) {
      slides[index].classList.remove("is-active");
      dots[index].classList.remove("is-active");
      index = (next + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      dots[index].classList.add("is-active");
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide") || 0));
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 6200);
  }

  function initLocalFilter() {
    var input = $(".page-filter");
    var cards = $all(".filter-grid .movie-card");
    if (!input || !cards.length) {
      return;
    }
    input.addEventListener("input", function () {
      var term = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        card.classList.toggle("is-hidden", term && haystack.indexOf(term) === -1);
      });
    });
  }

  function resultCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return "" +
      "<article class=\"movie-card\">" +
      "<a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\">" +
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"movie-year\">" + escapeHtml(movie.year) + "</span>" +
      "<span class=\"movie-play\">播放</span>" +
      "</a>" +
      "<div class=\"movie-card-body\">" +
      "<p class=\"movie-meta\">" + escapeHtml(movie.region) + " · " + escapeHtml(movie.type) + "</p>" +
      "<h2><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h2>" +
      "<p class=\"movie-desc\">" + escapeHtml(movie.desc) + "</p>" +
      "<div class=\"tag-row\">" + tags + "</div>" +
      "</div>" +
      "</article>";
  }

  function initSearchPage() {
    var input = $("#site-search-input");
    var button = $("#site-search-button");
    var output = $("#search-results");
    if (!input || !button || !output || !window.SEARCH_DATA) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;
    function runSearch() {
      var term = input.value.trim().toLowerCase();
      var data = window.SEARCH_DATA;
      var results = term ? data.filter(function (movie) {
        return movie.text.toLowerCase().indexOf(term) !== -1;
      }) : data.slice(0, 36);
      output.innerHTML = results.slice(0, 120).map(resultCard).join("") || "<p class=\"empty-results\">没有找到匹配影片</p>";
    }
    button.addEventListener("click", runSearch);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        runSearch();
      }
    });
    runSearch();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initHero();
    initLocalFilter();
    initSearchPage();
  });
}());
