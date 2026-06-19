(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var forms = document.querySelectorAll('[data-search-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var keyword = input ? input.value.trim() : '';
      if (keyword) {
        window.location.href = './search.html?q=' + encodeURIComponent(keyword);
      }
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;

  function showHero(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === heroIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === heroIndex);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showHero(i);
    });
  });

  if (slides.length > 1) {
    showHero(0);
    setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  var player = document.querySelector('[data-play]');
  if (player) {
    var video = player.querySelector('video');
    var layer = player.querySelector('.play-layer');
    var src = player.getAttribute('data-play');
    var started = false;

    function begin() {
      if (!video || !src) {
        return;
      }
      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
        started = true;
      }
      if (layer) {
        layer.classList.add('hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    player.addEventListener('click', function (event) {
      if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'video' && started) {
        return;
      }
      begin();
    });
  }

  var searchBox = document.querySelector('[data-search-box]');
  var searchResults = document.querySelector('[data-search-results]');

  if (searchBox && searchResults && window.MOVIE_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    searchBox.value = initial;

    function card(item) {
      return [
        '<article class="movie-card">',
        '<a href="' + item.link + '">',
        '<div class="poster">',
        '<img src="' + item.cover + '" alt="' + item.title + '">',
        '<div class="badge-row"><span class="badge">' + item.year + '</span><span class="badge score">' + item.rating + '</span></div>',
        '<div class="poster-text">' + item.oneLine + '</div>',
        '</div>',
        '<div class="card-body">',
        '<h3>' + item.title + '</h3>',
        '<div class="card-meta"><span>' + item.region + '</span><span>' + item.category + '</span></div>',
        '<p class="card-desc">' + item.oneLine + '</p>',
        '</div>',
        '</a>',
        '</article>'
      ].join('');
    }

    function render(keyword) {
      var q = keyword.trim().toLowerCase();
      if (!q) {
        searchResults.innerHTML = '<div class="empty-note">输入片名、类型、地区或关键词即可查找影片。</div>';
        return;
      }
      var list = window.MOVIE_INDEX.filter(function (item) {
        return item.text.indexOf(q) !== -1;
      }).slice(0, 80);
      if (!list.length) {
        searchResults.innerHTML = '<div class="empty-note">暂未找到匹配影片，可尝试更短的关键词。</div>';
        return;
      }
      searchResults.innerHTML = '<div class="grid cards-medium">' + list.map(card).join('') + '</div>';
    }

    searchBox.addEventListener('input', function () {
      render(searchBox.value);
    });
    render(initial);
  }
})();