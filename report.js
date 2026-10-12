// The Report button: saves the report in Supabase and opens a Gmail draft to the developer.
(function () {
  var REPORTS_URL = 'https://rpkaxccjkwimirncyynt.supabase.co/rest/v1/reports';
  var KEY = 'sb_publishable_eESVbxId7MKgmXqoQs8JKA_JHhBIDd-';
  var TO = 'guykadosh22@gmail.com';
  var KINDS = { bug: 'Bug', idea: 'Idea', question: 'Question', other: 'Other' };
  var APPS = { windows: 'Windows app', android: 'Android app', website: 'Website', other: 'Other' };

  var dialog = null;

  function options(map) {
    return Object.keys(map).map(function (k) { return '<option value="' + k + '">' + map[k] + '</option>'; }).join('');
  }

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'report';
    dialog.setAttribute('aria-labelledby', 'report-title');
    dialog.innerHTML =
      '<form class="report-form" method="dialog" novalidate>' +
        '<header class="report-head">' +
          '<h2 id="report-title">Report</h2>' +
          '<button type="button" class="report-close" aria-label="Close">×</button>' +
        '</header>' +
        '<p class="report-intro">Found a bug or have an idea? Write it here. Sending opens Gmail with the email ready to go.</p>' +
        '<div class="report-row">' +
          '<label>About<select name="kind">' + options(KINDS) + '</select></label>' +
          '<label>Where<select name="app">' + options(APPS) + '</select></label>' +
        '</div>' +
        '<label>What happened?<textarea name="message" rows="6" maxlength="4000" required placeholder="What you did, what you expected and what happened instead"></textarea></label>' +
        '<div class="report-row">' +
          '<label><span class="report-label">Your name or team <em>(optional)</em></span><input name="name" maxlength="100" autocomplete="name" /></label>' +
          '<label><span class="report-label">Email for a reply <em>(optional)</em></span><input name="email" type="email" maxlength="200" autocomplete="email" /></label>' +
        '</div>' +
        '<p class="report-status" role="status"></p>' +
        '<div class="report-actions">' +
          '<button type="submit" class="btn btn-red">Send with Gmail</button>' +
          '<a class="report-mailto" href="#">Use another email app</a>' +
        '</div>' +
      '</form>';
    document.body.appendChild(dialog);

    var form = dialog.querySelector('form');
    dialog.querySelector('.report-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send(form, 'gmail');
    });
    dialog.querySelector('.report-mailto').addEventListener('click', function (e) {
      e.preventDefault();
      send(form, 'mailto');
    });
  }

  function read(form) {
    var f = form.elements;
    return {
      kind: f.kind.value,
      app: f.app.value,
      message: f.message.value.trim(),
      name: f.name.value.trim(),
      email: f.email.value.trim(),
    };
  }

  function email(r) {
    var subject = 'PitBoard report: ' + KINDS[r.kind] + ' (' + APPS[r.app] + ')';
    var lines = [r.message, '', '--'];
    if (r.name) lines.push('From: ' + r.name);
    if (r.email) lines.push('Reply to: ' + r.email);
    lines.push('Sent from ' + location.href);
    return { subject: subject, body: lines.join('\n') };
  }

  function save(r) {
    return fetch(REPORTS_URL, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        kind: r.kind,
        app: r.app,
        message: r.message,
        name: r.name || null,
        email: r.email || null,
        page: location.pathname.slice(0, 300),
      }),
    }).then(function (res) { if (!res.ok) throw new Error(res.status); });
  }

  function send(form, via) {
    var status = form.querySelector('.report-status');
    var r = read(form);
    if (!r.message) {
      status.textContent = 'Write a few words about what happened first.';
      status.className = 'report-status error';
      form.elements.message.focus();
      return;
    }
    if (r.email && !form.elements.email.checkValidity()) {
      status.textContent = 'That email address doesn\'t look right.';
      status.className = 'report-status error';
      form.elements.email.focus();
      return;
    }

    // Open the email first, while the click still counts as the user's action, or the popup gets blocked.
    var mail = email(r);
    if (via === 'gmail') {
      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(TO) +
        '&su=' + encodeURIComponent(mail.subject) + '&body=' + encodeURIComponent(mail.body), '_blank', 'noopener');
    } else {
      window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(mail.subject) + '&body=' + encodeURIComponent(mail.body);
    }

    status.textContent = 'Saving…';
    status.className = 'report-status';
    save(r).then(function () {
      status.textContent = 'Thanks! Your report was saved. Press Send in the email that opened.';
      status.className = 'report-status ok';
      form.elements.message.value = '';
    }, function () {
      status.textContent = 'Couldn\'t save the report here, but you can still send the email that opened.';
      status.className = 'report-status error';
    });
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-report]');
    if (!trigger) return;
    e.preventDefault();
    if (!dialog) build();
    var status = dialog.querySelector('.report-status');
    status.textContent = '';
    status.className = 'report-status';
    dialog.showModal();
    dialog.querySelector('textarea').focus();
  });
})();
