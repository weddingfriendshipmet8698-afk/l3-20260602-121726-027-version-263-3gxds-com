(function() {
  var menuButton = document.querySelector(".menu-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function() {
      mobileMenu.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener("click", function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.getElementById("searchInput");
  var categoryFilter = document.getElementById("categoryFilter");
  var yearFilter = document.getElementById("yearFilter");
  var searchResults = document.getElementById("searchResults");
  var searchSummary = document.getElementById("searchSummary");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function card(movie) {
    var tags = movie.tags.slice(0, 4).map(function(tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return "<article class=\"movie-card compact\">" +
      "<a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">" +
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"poster-badge\">" + escapeHtml(movie.yearText) + "</span>" +
      "</a>" +
      "<div class=\"movie-card-body\">" +
      "<div class=\"movie-meta-row\"><a href=\"" + escapeHtml(movie.categoryFile) + "\">" + escapeHtml(movie.categoryName) + "</a><span>" + escapeHtml(movie.region) + "</span></div>" +
      "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>" +
      "<p>" + escapeHtml(movie.oneLine) + "</p>" +
      "<div class=\"tag-list\">" + tags + "</div>" +
      "</div>" +
      "</article>";
  }

  function applySearch() {
    if (!searchResults || !window.SiteMovies) {
      return;
    }

    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var category = categoryFilter ? categoryFilter.value : "";
    var year = yearFilter ? yearFilter.value : "";

    var matched = window.SiteMovies.filter(function(movie) {
      var haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.genre,
        movie.yearText,
        movie.categoryName,
        movie.oneLine,
        movie.tags.join(" ")
      ].join(" ").toLowerCase();

      if (keyword && haystack.indexOf(keyword) === -1) {
        return false;
      }
      if (category && movie.categoryName !== category) {
        return false;
      }
      if (year && String(movie.yearText) !== year) {
        return false;
      }
      return true;
    }).slice(0, 120);

    searchResults.innerHTML = matched.map(card).join("");
    if (searchSummary) {
      searchSummary.textContent = matched.length ? "已匹配到相关影片，点击卡片进入详情页。" : "没有找到匹配影片，可以更换关键词或筛选条件。";
    }
  }

  if (searchInput || categoryFilter || yearFilter) {
    var params = new URLSearchParams(window.location.search);
    if (searchInput && params.get("q")) {
      searchInput.value = params.get("q");
    }
    [searchInput, categoryFilter, yearFilter].forEach(function(control) {
      if (control) {
        control.addEventListener("input", applySearch);
        control.addEventListener("change", applySearch);
      }
    });
    applySearch();
  }
})();
