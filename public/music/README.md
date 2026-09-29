# Background music

**`wedding-theme.mp3`** — "Traditional wedding — ceremonial vibe with shehnai"
(1:34, ~3 MB), from Pixabay Music under the Pixabay Content License (free to
use, no attribution required):
https://pixabay.com/music/wedding-traditional-wedding-ceremonial-vibe-with-shehna-376293/

Also tried: the shorter version by the same artist (0:59) —
https://pixabay.com/music/wedding-traditional-wedding-ceremonial-vibe-with-shehna-1-376289/

To use a different track, replace the file (keep the name) and update `title`
under `music` in `src/data/wedding.ts`.

## How it behaves

- It starts on its own as the invitation opens, fading up from silence to a
  soft background level, and loops.
- Browsers block sound until the visitor has interacted with the page. When
  that first attempt is refused, the button pulses "Tap for music" and the
  track starts on the guest's first tap, click or key press anywhere.
  (Scrolling does not count as interaction for browsers.)
- The one floating button mutes and unmutes. Muting is remembered, so a guest
  who muted is not surprised by sound when they reopen the link.
- With no file here the button shows a disabled "No music" state, so the page
  is never broken by a missing track.

## Choosing another file

- **Format**: MP3 — every browser plays it.
- **Length**: 1–3 minutes is plenty; it loops.
- **Size**: keep it under ~3 MB; guests open this on mobile data.
- **Rights**: use a track you own or one licensed for this use (Pixabay Music,
  YouTube Audio Library, Free Music Archive).
