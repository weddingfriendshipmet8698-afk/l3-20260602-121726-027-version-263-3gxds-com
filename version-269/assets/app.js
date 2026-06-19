(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    function setupNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var menu = document.querySelector("[data-nav-menu]");
        var search = document.querySelector(".nav-search");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
            if (search) {
                search.classList.toggle("is-open");
            }
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var previous = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;
        function show(index) {
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
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        if (previous) {
            previous.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        if (!panel) {
            return;
        }
        var input = panel.querySelector("[data-filter-search]");
        var region = panel.querySelector("[data-filter-region]");
        var type = panel.querySelector("[data-filter-type]");
        var year = panel.querySelector("[data-filter-year]");
        var category = panel.querySelector("[data-filter-category]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var empty = document.querySelector("[data-empty-state]");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query && input) {
            input.value = query;
        }
        function valueOf(element) {
            return element ? element.value : "";
        }
        function apply() {
            var text = valueOf(input).trim().toLowerCase();
            var regionValue = valueOf(region);
            var typeValue = valueOf(type);
            var yearValue = valueOf(year);
            var categoryValue = valueOf(category);
            var visible = 0;
            cards.forEach(function (card) {
                var matchedText = !text || String(card.getAttribute("data-search") || "").indexOf(text) !== -1;
                var matchedRegion = !regionValue || card.getAttribute("data-region") === regionValue;
                var matchedType = !typeValue || card.getAttribute("data-type") === typeValue;
                var matchedYear = !yearValue || card.getAttribute("data-year") === yearValue;
                var matchedCategory = !categoryValue || card.getAttribute("data-category") === categoryValue;
                var matched = matchedText && matchedRegion && matchedType && matchedYear && matchedCategory;
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }
        [input, region, type, year, category].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener("input", apply);
            control.addEventListener("change", apply);
        });
        apply();
    }

    function setupMoviePlayer(streamUrl) {
        var video = document.querySelector("[data-player-video]");
        var overlay = document.querySelector("[data-player-overlay]");
        var button = document.querySelector("[data-player-button]");
        var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-player-start]"));
        var attached = false;
        function attach() {
            if (attached || !video || !streamUrl) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ maxBufferLength: 30 });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                return;
            }
            video.src = streamUrl;
        }
        function start(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            attach();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            if (video) {
                video.controls = true;
                var playRequest = video.play();
                if (playRequest && typeof playRequest.catch === "function") {
                    playRequest.catch(function () {});
                }
            }
        }
        if (overlay) {
            overlay.addEventListener("click", start);
        }
        if (button) {
            button.addEventListener("click", start);
        }
        triggers.forEach(function (trigger) {
            trigger.addEventListener("click", start);
        });
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
        }
    }

    ready(function () {
        setupNavigation();
        setupHero();
        setupFilters();
    });

    window.setupMoviePlayer = setupMoviePlayer;
})();
