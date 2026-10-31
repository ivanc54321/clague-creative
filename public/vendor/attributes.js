(function () {
  function initReadTime() {
    var contents = document.querySelector('[fs-readtime-element="contents"]');
    var timeEls = document.querySelectorAll('[fs-readtime-element="time"]');
    if (!contents || !timeEls.length) return;
    var text = (contents.textContent || '').trim();
    var words = text ? text.split(/\s+/).length : 0;
    var minutes = Math.max(1, Math.ceil(words / 200));
    timeEls.forEach(function (el) {
      el.textContent = String(minutes);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReadTime);
  } else {
    initReadTime();
  }
})();
