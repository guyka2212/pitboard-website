// The Report and Suggest buttons open Gmail drafts. Each one's address and subject come from the
// site_settings table in Supabase (<name>_email, <name>_subject), so they can be changed there;
// the links in the HTML are the fallback if Supabase can't be reached.
(function () {
  var KINDS = ['report', 'suggestion'];
  var keys = [];
  KINDS.forEach(function (k) { keys.push(k + '_email', k + '_subject'); });
  var SETTINGS_URL = 'https://rpkaxccjkwimirncyynt.supabase.co/rest/v1/site_settings?select=key,value&key=in.(' + keys.join(',') + ')';
  var KEY = 'sb_publishable_eESVbxId7MKgmXqoQs8JKA_JHhBIDd-';

  function gmailUrl(to, subject) {
    return 'https://mail.google.com/mail/u/0/?fs=1&to=' + encodeURIComponent(to).replace(/%40/g, '@') +
      '&su=' + encodeURIComponent(subject).replace(/%20/g, '+') + '&tf=cm';
  }

  fetch(SETTINGS_URL, { headers: { apikey: KEY } })
    .then(function (res) { return res.ok ? res.json() : []; })
    .then(function (rows) {
      var settings = {};
      rows.forEach(function (row) { if (row.value && row.value.trim()) settings[row.key] = row.value.trim(); });
      KINDS.forEach(function (kind) {
        var to = settings[kind + '_email'];
        var subject = settings[kind + '_subject'];
        if (!to || !subject) return;
        document.querySelectorAll('a[data-mail="' + kind + '"]').forEach(function (link) {
          link.href = gmailUrl(to, subject);
        });
      });
    })
    .catch(function () {});
})();
