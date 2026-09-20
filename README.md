# BAIS Club

Landing hub for the **BAIS Club** — Business Analytics & Information Systems,
University of Business and Technology.

One mobile-first page: the WhatsApp group, LinkedIn, TikTok, and a one-tap
event survey whose responses all land in one place.

```
├── index.html
├── assets/
│   ├── styles.css          design system + all styling
│   ├── app.js              the event survey   ← the file to configure
│   ├── logo.png            the club mark, as supplied
│   ├── banner.webp         the club banner, as supplied
│   ├── social-*.{png,webp} WhatsApp, LinkedIn and TikTok marks
│   └── fonts/              Archivo + IBM Plex Mono, self-hosted
└── README.md
```

Plain HTML, CSS and JavaScript. No build step, no framework, no cookies, and
nothing that asks a student for their name, number, email or student ID.

## The event survey

Five emoji, one tap, anonymous. Only the rating, the score and the time are
ever recorded — nothing about the student.

Responses go to the club's Google Sheet:

**BAIS Club — Event Feedback**
https://docs.google.com/spreadsheets/d/19rMlKacRGPL7nTIsCoU_JMXG5llcVPiXtbPyXvoZuN4/edit

The page posts each tap to an Apps Script web app that lives inside that
sheet (`SHEET_URL` in `assets/app.js`; see SHEET-SETUP.md for how it was
deployed). That URL is safe to have in a public page because it accepts one
thing — a new row. It cannot read the sheet, change or delete rows, or reach
anything else in the Drive account.

**Use the live site for events, not the artifact preview.** A published
artifact runs under a content policy that blocks requests to other sites, so
the sheet cannot be reached from there; the artifact falls back to its own
database and the responses would end up split across two places. The GitHub
Pages URL has no such restriction and writes straight to the sheet.

## Editing

| Change | Where |
| --- | --- |
| Any of the three links | `index.html`, search for the URL |
| Club name / strapline | `index.html`, `.title` and `.eyebrow` |
| Survey wording or emoji | the `SCALE` array in `assets/app.js` |
| Colours, spacing, type | the token block at the top of `assets/styles.css` |

The palette is sampled from the club mark itself (navy `#082858`), and the
club's own letterspaced caps are carried through in IBM Plex Mono.

## Running it

```bash
python3 -m http.server 8000     # then http://127.0.0.1:8000/
```

The fonts are committed, so the page needs no network of its own — it runs
from a `file://` path or a USB stick.
