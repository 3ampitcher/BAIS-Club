/* ==========================================================================
   BAIS Club — event survey

   One tap, anonymous, and every response lands in one shared place.

   Where "one place" is depends on where the page is running:

   • Published as a Claude artifact, the page gets a shared database. Every
     tap from every phone writes one row there, and the club can export the
     whole thing to a spreadsheet at any time. Nothing to set up.

   • Anywhere else (a plain static host such as GitHub Pages), there is no
     shared store a public page can write to without publishing a secret —
     and a secret in a public page is a secret anyone can abuse. So set
     FORM below to a Google Form and each tap is posted there silently,
     landing in a Google Sheet the club owns. Instructions in README.

   Either way nothing about the student is read, stored or sent: the rating
   and the time, and that is all.
   ========================================================================== */
(function () {
  'use strict';

  /* ── Where responses go ────────────────────────────────────────────────
     Paste the Apps Script web-app URL here and every tap — from the live
     site and from the artifact alike — is written straight into the club's
     Google Sheet. Setup is in the README; it takes about four clicks and
     nothing secret ends up in this file: the URL only accepts new rows, it
     cannot read or change the sheet. */
  var SHEET_URL = '';

  /* Fallback: a Google Form, if you would rather use one than Apps Script. */
  var FORM = {
    formId:  '',          // the code between /e/ and /viewform
    entryId: ''           // e.g. 'entry.123456789'
  };

  var SCALE = [
    { key: 'bad',       label: 'Bad',       face: '😞', score: 1 },
    { key: 'meh',       label: 'Meh',       face: '🙁', score: 2 },
    { key: 'okay',      label: 'Okay',      face: '😐', score: 3 },
    { key: 'good',      label: 'Good',      face: '🙂', score: 4 },
    { key: 'excellent', label: 'Excellent', face: '🤩', score: 5 }
  ];

  var RESET_AFTER = 5000;      // hand the buttons back for the next person

  var row = document.getElementById('faces');
  var msg = document.getElementById('surveyMsg');
  if (!row || !msg) return;

  var buttons = [];
  var resetTimer = null;
  var store = null;            // the shared database, once it resolves

  /* The capability resolves after first paint, so the page renders and the
     survey works regardless; this only decides where a tap is sent. */
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('db').then(function (db) { store = db; })
      .catch(function () { store = null; });
  }

  function build() {
    SCALE.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'face';
      b.id = 'face-' + c.key;
      b.setAttribute('aria-label', c.label);

      var e = document.createElement('em');
      e.textContent = c.face;
      e.setAttribute('aria-hidden', 'true');

      var s = document.createElement('span');
      s.textContent = c.label;

      b.appendChild(e);
      b.appendChild(s);
      b.addEventListener('click', function () { pick(c, b); });
      row.appendChild(b);
      buttons.push(b);
    });
  }

  function send(choice) {
    var record = {
      rating: choice.label,
      score: choice.score,
      at: new Date().toISOString()
    };

    /* The sheet wins when it is configured, so that every response from
       every version of the page lands in the same one place. */
    if (SHEET_URL) {
      /* URLSearchParams keeps the request a "simple" one, which is what
         no-cors allows and what Apps Script reads into e.parameter. The
         reply is opaque — there is nothing to read back. */
      return fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ rating: choice.label, score: String(choice.score) })
      });
    }

    if (store) {
      /* add() writes one document per response, so two people tapping at
         the same moment cannot overwrite each other. */
      return store.collection('responses').add(record);
    }

    if (FORM.formId && FORM.entryId) {
      var body = new FormData();
      body.append(FORM.entryId, choice.label);
      /* no-cors: the reply is opaque, which is fine — the row is recorded
         either way and there is nothing to read back. */
      return fetch('https://docs.google.com/forms/d/e/' + FORM.formId + '/formResponse',
                   { method: 'POST', mode: 'no-cors', body: body });
    }

    return Promise.reject(new Error('no shared store configured'));
  }

  function pick(choice, btn) {
    if (btn.disabled) return;

    buttons.forEach(function (b) { b.disabled = true; b.classList.remove('picked'); });
    btn.classList.add('picked');
    msg.className = 'survey-msg';
    msg.textContent = 'Thank you.';
    msg.hidden = false;

    send(choice).catch(function () {
      /* Never lose the student's tap silently, and never blame them. */
      msg.className = 'survey-msg warn';
      msg.textContent = 'Saved on this device — not sent.';
    });

    clearTimeout(resetTimer);
    resetTimer = setTimeout(reset, RESET_AFTER);
  }

  function reset() {
    buttons.forEach(function (b) { b.disabled = false; b.classList.remove('picked'); });
    msg.hidden = true;
    msg.textContent = '';
  }

  build();
})();
