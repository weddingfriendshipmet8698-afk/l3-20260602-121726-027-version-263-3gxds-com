(function() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".menu-toggle");
    if (toggle && header) {
        toggle.addEventListener("click", function() {
            header.classList.toggle("menu-open");
        });
    }

    document.querySelectorAll("img").forEach(function(img) {
        img.addEventListener("error", function() {
            img.classList.add("is-missing");
        });
    });

    document.querySelectorAll("[data-carousel]").forEach(function(carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dots button"));
        var index = 0;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }

        dots.forEach(function(dot, i) {
            dot.addEventListener("click", function() {
                show(i);
            });
        });

        if (slides.length > 1) {
            setInterval(function() {
                show(index + 1);
            }, 5200);
        }
    });

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function applyFilter(scope) {
        var input = document.querySelector(".page-filter");
        var yearSelect = document.querySelector(".year-filter");
        var query = normalize(input ? input.value : "");
        var year = normalize(yearSelect ? yearSelect.value : "");
        var items = scope.querySelectorAll(".movie-card, .rank-row");

        items.forEach(function(item) {
            var text = normalize([
                item.getAttribute("data-title"),
                item.getAttribute("data-genre"),
                item.getAttribute("data-year"),
                item.getAttribute("data-region"),
                item.textContent
            ].join(" "));
            var matchesText = !query || text.indexOf(query) !== -1;
            var matchesYear = !year || normalize(item.getAttribute("data-year")) === year;
            item.classList.toggle("is-filtered-out", !(matchesText && matchesYear));
        });
    }

    var scope = document.querySelector(".filter-scope");
    var pageInput = document.querySelector(".page-filter");
    var yearInput = document.querySelector(".year-filter");
    if (scope && pageInput) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
            pageInput.value = q;
        }
        pageInput.addEventListener("input", function() {
            applyFilter(scope);
        });
        if (yearInput) {
            yearInput.addEventListener("change", function() {
                applyFilter(scope);
            });
        }
        applyFilter(scope);
    }
}());
