(function () {
  var side = document.querySelector('.docs-side');
  var toggle = document.querySelector('.docs-bar button');
  var current = document.querySelector('.docs-bar span');
  var links = Array.prototype.slice.call(document.querySelectorAll('.side-group a'));

  function closeSide() {
    side.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = side.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    if (open) side.querySelector('a').focus();
  });
  links.forEach(function (a) { a.addEventListener('click', closeSide); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSide(); });
  document.addEventListener('click', function (e) {
    if (side.classList.contains('open') && !side.contains(e.target) && !toggle.contains(e.target)) closeSide();
  });

  // Highlight the section being read in the sidebar.
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function markCurrent() {
    var line = window.innerHeight * 0.3;
    var active = 0;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) active = i; });
    links.forEach(function (a, i) {
      if (i === active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    current.textContent = links[active].textContent;
  }
  var queued = false;
  window.addEventListener('scroll', function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; markCurrent(); });
  }, { passive: true });
  markCurrent();

  // Screenshots open full size.
  var viewer = document.querySelector('.viewer');
  var viewerImg = viewer.querySelector('img');
  document.querySelectorAll('.shot-frame img').forEach(function (img) {
    img.addEventListener('click', function () {
      viewerImg.src = img.currentSrc || img.src;
      viewerImg.alt = img.alt;
      viewer.showModal();
    });
  });
  viewer.addEventListener('click', function () { viewer.close(); });
})();
