// The Report button opens a Gmail draft. The address and subject come from the site_settings table in
// Supabase, so they can be changed there; the link in the HTML is the fallback if Supabase can't be reached.
(function () {
  var SETTINGS_URL = 'https://rpkaxccjkwimirncyynt.supabase.co/rest/v1/site_settings?select=key,value&key=in.(report_email,report_subject)';
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
      if (!settings.report_email) return;
      var url = gmailUrl(settings.report_email, settings.report_subject || 'bug report on pitboard');
      document.querySelectorAll('a[data-report]').forEach(function (link) { link.href = url; });
    })
    .catch(function () {});
})();
