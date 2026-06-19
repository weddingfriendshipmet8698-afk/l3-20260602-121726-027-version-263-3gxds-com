document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-mobile-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (toggle && mobilePanel) {
    toggle.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var forms = document.querySelectorAll("[data-search-form]");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      var input = form.querySelector("input");
      if (!input || !input.value.trim()) {
        event.preventDefault();
        return;
      }
      form.action = "search.html";
      input.name = "q";
    });
  });

  var slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterInput = document.querySelector("[data-filter-input]");
  var filterSelect = document.querySelector("[data-filter-select]");
  var cards = Array.from(document.querySelectorAll("[data-film-card]"));
  var empty = document.querySelector("[data-empty-state]");

  function applyFilter() {
    if (!cards.length) {
      return;
    }

    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
    var year = filterSelect ? filterSelect.value : "";
    var shown = 0;

    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-tags") || "",
        card.getAttribute("data-region") || "",
        card.getAttribute("data-genre") || ""
      ].join(" ").toLowerCase();
      var cardYear = card.getAttribute("data-year") || "";
      var matched = (!keyword || text.indexOf(keyword) !== -1) && (!year || cardYear === year);
      card.style.display = matched ? "" : "none";
      if (matched) {
        shown += 1;
      }
    });

    if (empty) {
      empty.style.display = shown ? "none" : "block";
    }
  }

  if (filterInput) {
    filterInput.addEventListener("input", applyFilter);
  }
  if (filterSelect) {
    filterSelect.addEventListener("change", applyFilter);
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get("q");
  if (query && filterInput) {
    filterInput.value = query;
    applyFilter();
  }
});
