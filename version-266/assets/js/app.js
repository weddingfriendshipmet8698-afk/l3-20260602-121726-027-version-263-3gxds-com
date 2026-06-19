(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalizeText(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupForms() {
    selectAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function () {
        var input = form.querySelector('input[name="q"]');

        if (input) {
          input.value = input.value.trim();
        }
      });
    });
  }

  function filterScope(scope, query) {
    var cards = selectAll('.movie-card', scope);
    var empty = scope.querySelector('[data-empty-state]');
    var normalized = normalizeText(query);
    var visibleCount = 0;

    cards.forEach(function (card) {
      var text = normalizeText(card.getAttribute('data-search'));
      var matched = !normalized || text.indexOf(normalized) !== -1;
      card.classList.toggle('is-hidden', !matched);

      if (matched) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  function setupFilters() {
    selectAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-live-search]');

      if (!input) {
        return;
      }

      input.addEventListener('input', function () {
        filterScope(scope, input.value);
      });

      if (document.body.getAttribute('data-page') === 'search') {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        input.value = query;
        filterScope(scope, query);
      }
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');

    if (!hero) {
      return;
    }

    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var current = 0;
    var timer = null;

    function activate(index) {
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
        activate(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    if (slides.length > 1) {
      start();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupForms();
    setupFilters();
    setupHero();
  });
})();
