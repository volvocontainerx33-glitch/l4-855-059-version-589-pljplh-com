(function () {
  var menuButton = document.querySelector('.menu-toggle');
  if (menuButton) {
    menuButton.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
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

    function next() {
      show(current + 1);
    }

    function start() {
      timer = window.setInterval(next, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    var previousButton = carousel.querySelector('[data-carousel-prev]');
    var nextButton = carousel.querySelector('[data-carousel-next]');

    if (previousButton) {
      previousButton.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide-to')) || 0);
        restart();
      });
    });

    start();
  }
})();
