# Portfolio 95

A personal portfolio built as a Windows 95 desktop — draggable, resizable windows,
a working taskbar and Start menu, and a boot sequence. Built with Next.js 16 and
React 19.

## What's in it

**About Me** — bio, education, grouped skills and experience.

**Projects** — each entry opens a detail view with highlights and links:

- *NFL Fantasy Value Model* — an ML system scoring every fantasy-relevant NFL
  player 0–100 on redraft and dynasty horizons. Opens a live viewer (below).
- *Vision Rock Paper Scissors* — a physical game of rock paper scissors played
  through a webcam using MediaPipe hand tracking.

**NFL Player Grades** — an interactive window over the model's scored output for
all 733 players: redraft/dynasty toggle, position filters, search, and a score
bar per row. Data is exported from the model's `06_inference.py` to
`public/data/player-scores.json`.

**Fun Zone** — Snake and Pong, written as React components, plus
[Madden 99](https://github.com/NotABot122/madden-99-game) running inline.

## Running locally

```bash
npm install
npm run dev
```

## How Madden 99 is embedded

Madden 99 is a separate Next.js app using Tailwind 3, while this portfolio is
Next 16 on Tailwind 4. Rather than port the source and fight the version gap, the
game is built as a static export rooted at `/madden`, committed to
`public/madden/`, and embedded in an iframe. Its styles stay fully isolated and
the whole thing still deploys as a single site.

Two details make that work:

- The game's data fetches are base-path aware, so `/madden/data/...` resolves
  correctly under the subpath.
- `next.config.ts` rewrites directory-style URLs (`/madden/`, `/madden/classic/`)
  to their `index.html`, because Next doesn't resolve directory indexes for files
  in `public/`. Without it the game's internal navigation 404s on refresh.

To refresh the embedded build: re-export the game with
`EXPORT_EMBED=1 next build` and copy its `out/` into `public/madden/`.
