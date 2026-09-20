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

Five emoji, one tap, anonymous. Only the rating and the time are ever recorded.

**Where the responses go depends on where the page is running.**

### Published as a Claude artifact — works now, nothing to set up

The published page is granted a shared database. Every tap from every phone
writes one row into it, and the club can pull the whole set out as a
spreadsheet at any time. This is the version to hand to students.

### On a plain static host (GitHub Pages) — needs a form

A public static page has nowhere of its own to write. It cannot use GitHub as
the backend either: any token that let the page write would have to ship
inside the page, where anyone could read it and then write — or delete —
whatever they liked in the repository. A public page can hold no secret.

So on a static host the survey posts to a Google Form instead, which drops
each response into a Google Sheet the club owns. Set the two values at the
top of `assets/app.js`:

```js
var FORM = { formId: '', entryId: '' };
```

1. [forms.google.com](https://forms.google.com) → new blank form.
2. Add **one** question, type **Short answer**, e.g. "Event rating".
3. **⋮ → Get pre-filled link**, type anything, **Get link**, copy it.
4. From that URL: `formId` is the long code between `/e/` and `/viewform`;
   `entryId` is the `entry.123456789` part.

Responses then appear under the form's **Responses** tab and in its linked
Google Sheet.

Until one of the two is in place, a tap still thanks the student and the page
says plainly that it was not sent, rather than pretending it was.

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
