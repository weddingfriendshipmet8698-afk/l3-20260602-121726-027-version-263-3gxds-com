(function () {
  function setupPlayer(shell) {
    var video = shell.querySelector('video[data-play]');
    var cover = shell.querySelector('[data-play-button]');
    var streamUrl = video ? video.getAttribute('data-play') : '';
    var hlsInstance = null;
    var prepared = false;

    if (!video || !cover || !streamUrl) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        prepared = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        prepared = true;
        return;
      }

      video.src = streamUrl;
      prepared = true;
    }

    function play() {
      prepare();
      cover.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');

      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          cover.classList.remove('is-hidden');
        });
      }
    }

    cover.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
})();
