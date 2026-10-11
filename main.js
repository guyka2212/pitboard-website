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

// Every download click adds one to the counts in Supabase (see /counter).
(function () {
  var COUNT_URL = 'https://rpkaxccjkwimirncyynt.supabase.co/rest/v1/rpc/count_download';
  var KEY = 'sb_publishable_eESVbxId7MKgmXqoQs8JKA_JHhBIDd-';

  document.querySelectorAll('a[data-count]').forEach(function (link) {
    link.addEventListener('click', function () {
      fetch(COUNT_URL, {
        method: 'POST',
        keepalive: true,
        headers: { apikey: KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: link.dataset.count }),
      }).catch(function () {});
    });
  });
})();
