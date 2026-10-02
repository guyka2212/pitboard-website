(function () {
  var ua = navigator.userAgent;
  var platform = /Android/i.test(ua) ? 'android' : /Windows/i.test(ua) ? 'windows' : null;
  if (!platform) return;

  var card = document.querySelector('.dl[data-platform="' + platform + '"]');
  if (card) {
    card.classList.add('is-yours');
    var label = document.createElement('span');
    label.className = 'dl-yours';
    label.textContent = 'Your device';
    card.querySelector('h3').appendChild(label);
  }

  // Put the matching download first in the hero on phones, where the buttons stack.
  var actions = document.querySelector('.hero-actions');
  var primary = actions && actions.querySelector('[data-platform="' + platform + '"]');
  if (primary) actions.insertBefore(primary, actions.firstChild);
})();
