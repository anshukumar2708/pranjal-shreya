# Background music

Place the track here as **`wedding-theme.mp3`**.

A shehnai instrumental or a Shree Ganesh vandana suits the invitation — something
calm and looping, since guests hear it under the whole page.

## How it behaves

- It starts on its own as the invitation opens, fading up from silence over
  ~2.6s to a soft background level (30% volume) rather than starting loud.
- Every browser blocks unprompted audio, so if the opening attempt is refused,
  the floating button pulses and reads "Tap for music" — the track then starts
  the moment the guest taps, presses a key or scrolls.
- It loops, and a guest who presses pause is never restarted automatically.
- With no file here the button shows a disabled "No music" state, so the page
  is never broken by a missing track.

## Choosing the file

- **Format**: MP3 is the safe choice; every browser plays it.
- **Length**: 1–3 minutes is plenty — it loops seamlessly.
- **Size**: keep it under ~3 MB. It is fetched on load, and guests will open
  this on mobile data.
- **Rights**: use a track you own or one licensed for this use. Royalty-free
  Indian wedding instrumentals are available from Pixabay Music, YouTube Audio
  Library and Free Music Archive.

The path and the name shown in the player's tooltip live in
`src/data/wedding.ts` under `music`.
