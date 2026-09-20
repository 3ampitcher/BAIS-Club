# Sending survey responses to the club's Google Sheet

The sheet already exists:

**BAIS Club — Event Feedback**
https://docs.google.com/spreadsheets/d/19rMlKacRGPL7nTIsCoU_JMXG5llcVPiXtbPyXvoZuN4/edit

It has the three columns the page writes: `Timestamp`, `Rating`, `Score`.

What is missing is the bit that lets a web page add a row to it. Google does
not let a public page write to a sheet directly — it would need a Google
login, and students have not got one. The standard answer is a tiny Apps
Script that lives *inside the sheet* and accepts new rows. Four steps:

---

### 1. Open the script editor

In the sheet: **Extensions → Apps Script**. A new tab opens with an empty
`Code.gs`.

### 2. Replace everything in it with this

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var p = (e && e.parameter) || {};

  sheet.appendRow([
    new Date(),
    p.rating || '',
    Number(p.score) || ''
  ]);

  return ContentService.createTextOutput('ok');
}
```

Save it (the disk icon).

### 3. Deploy it as a web app

**Deploy → New deployment**, then:

| Field | Set it to |
| --- | --- |
| Select type (gear icon) | **Web app** |
| Execute as | **Me** |
| Who has access | **Anyone** |

**Deploy**. Google asks you to authorise it the first time — it is your own
script writing to your own sheet, so approve it. (It may warn the app is
"unverified"; **Advanced → Go to …** gets past that.)

### 4. Copy the Web app URL and send it to me

It looks like:

```
https://script.google.com/macros/s/AKfycb.../exec
```

Paste it into `SHEET_URL` at the top of `assets/app.js`, or just send it over
and it will be wired in and pushed.

---

## Is that URL safe to put in a public page?

Yes, and this is the reason this route is used rather than a key of any kind.
The URL accepts one thing: a new row. It cannot read the sheet, cannot change
or delete existing rows, and cannot reach anything else in the Drive account.
The worst anyone who finds it can do is add junk rows, which you can delete.

That is the opposite of an API token, which is why the survey does not use
one. A token that let the page write would also let anyone who viewed the
page write — and a public page cannot keep a secret from the people viewing
it.

## Once it is set

Every tap, from the live site and from the artifact alike, appends a row
within a second or two. Nothing about the student is sent — the rating, the
score and the time, and that is all.
