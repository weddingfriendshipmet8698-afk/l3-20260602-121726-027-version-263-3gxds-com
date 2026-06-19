(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(target) {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
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
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
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

  var players = Array.prototype.slice.call(document.querySelectorAll('.video-player-card'));
  players.forEach(function (card) {
    var video = card.querySelector('video');
    var overlay = card.querySelector('.play-overlay');
    var url = card.getAttribute('data-video');
    var ready = false;
    var hls = null;

    function playVideo() {
      if (!video || !url) {
        return;
      }
      if (!ready) {
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
        } else {
          video.src = url;
        }
      }
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      video.setAttribute('controls', 'controls');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!ready) {
          playVideo();
        }
      });
      video.addEventListener('ended', function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });

  var results = document.getElementById('searchResults');
  if (results && window.SEARCH_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim();
    var input = document.getElementById('searchInput');
    var title = document.getElementById('searchTitle');
    if (input) {
      input.value = q;
    }

    function normalize(value) {
      return String(value || '').toLowerCase();
    }

    function card(movie) {
      var tags = movie.tags.slice(0, 3).map(function (tag) {
        return '<span>' + tag + '</span>';
      }).join('');
      return '<article class="movie-card compact">' +
        '<a class="card-cover" href="' + movie.url + '">' +
        '<img src="' + movie.cover + '" alt="' + movie.title + '" loading="lazy">' +
        '<span class="duration-badge">' + movie.duration + '</span>' +
        '</a>' +
        '<div class="card-body">' +
        '<div class="card-meta"><a href="' + movie.categoryUrl + '">' + movie.category + '</a><span>' + movie.year + '</span></div>' +
        '<h2><a href="' + movie.url + '">' + movie.title + '</a></h2>' +
        '<p>' + movie.oneLine + '</p>' +
        '<div class="card-tags">' + tags + '</div>' +
        '</div>' +
        '</article>';
    }

    var list = window.SEARCH_MOVIES;
    if (q) {
      var key = normalize(q);
      list = list.filter(function (movie) {
        return normalize(movie.title + ' ' + movie.region + ' ' + movie.type + ' ' + movie.year + ' ' + movie.genre + ' ' + movie.tags.join(' ') + ' ' + movie.oneLine).indexOf(key) !== -1;
      });
      if (title) {
        title.textContent = '与“' + q + '”相关的影片';
      }
    } else {
      list = list.slice(0, 60);
    }
    results.innerHTML = list.length ? list.slice(0, 240).map(card).join('') : '<div class="empty-state">没有找到匹配影片，请尝试其他关键词。</div>';
  }
})();
