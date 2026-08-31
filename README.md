# Pranjal & Sherya — Wedding Invitation

A premium one-page Indian wedding invitation built with **Next.js 16**, **React 19**, **TypeScript** and **Tailwind CSS v4**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Editing the wedding content

**Everything on the page comes from one file: [`src/data/wedding.ts`](src/data/wedding.ts).**
No component hardcodes a name, date, venue or photo — change the data and the whole
site updates. The shape of that data is documented in [`src/types/wedding.ts`](src/types/wedding.ts).

What lives there:

| Key | What it controls |
| --- | --- |
| `groom`, `bride` | Names, parents, bios, portraits, showcase galleries |
| `groomFamily`, `brideFamily` | Parents plus siblings/relatives grids and the family tree |
| `events` | Haldi, Mehendi, Barat, Reception — dates, times, venues, themes |
| `story` | The "Our Story" timeline |
| `gallery` | The masonry photo gallery and lightbox |
| `venue` | Venue card and the Google Maps link |
| `rsvp` | Form options, guest cap, deadline, and the API endpoint |
| `nav` | Floating navigation items |
| `music` | Background track path and title |
| `contact` | Footer phone/email entries |

### Replacing the placeholder photos

All 63 photos are dummy placeholders, served from two hosts and set through two
helpers at the top of [`src/data/wedding.ts`](src/data/wedding.ts):

| Helper | Source | Used for |
| --- | --- | --- |
| `scene(id, w, h)` | Unsplash | Ceremonies, decor, venue, gallery, couple portraits |
| `portrait(n)` | pravatar.cc | The 20 family member cards |

Unsplash ids are collected in the `SCENE` map so each slot reads as what it
depicts (`SCENE.brideSaree`, `SCENE.celebrationLights`, …).

To use real photos, drop them in `public/images/` and replace the value with a
plain path — the helpers are only a convenience, any string works:

```ts
image: "/images/pranjal.jpg",
alt: "Portrait of Pranjal Singh, the groom",
```

Remote hosts must be allow-listed in [`next.config.ts`](next.config.ts) under
`images.remotePatterns`; local `/public` paths need no configuration.

**If a photo fails to load**, [`WeddingImage`](src/components/ui/WeddingImage.tsx)
swaps in `public/images/placeholder.svg` — a local marigold card reading
"Photograph coming soon". The layout and alt text stay intact, so a placeholder
host going down can never leave blank holes in the invitation.

### Background music

The floating player points at `music.src` (`/music/wedding-theme.mp3` by default).
That file is **not** included — add your own at `public/music/wedding-theme.mp3`.
Until then the player detects the missing file and shows a disabled "No music" state.
Playback never starts automatically; the guest presses play.

### Connecting the RSVP form

The form is fully validated and has loading, success and error states, but no backend.
Point `rsvp.endpoint` at an API route and it will `POST` the form values as JSON:

```ts
rsvp: { endpoint: "/api/rsvp", ... }
```

With `endpoint: null` it simulates a submission locally.

### Google Maps directions

Set `venue.mapsUrl` to the real place link. The current value is a search URL for the
dummy venue.

## Project structure

```
src/
  app/
    layout.tsx           fonts, metadata, viewport
    page.tsx             composes every section in order
    globals.css          design tokens, utilities, keyframes, reduced-motion
  components/
    wedding/             Navbar, HeroSection, Countdown, CoupleSection,
                         WeddingEvents, WeddingTimeline, StorySection,
                         FamilySection, FamilyMemberCard, FamilyTree,
                         CoupleShowcase, GallerySection, VenueSection,
                         RSVPSection, AddToCalendar, InvitationSection,
                         FinalInvitation, MusicPlayer, Footer
    decorations/         FloralDivider, FlowerCorner, FloatingPetals, Varmala,
                         MarigoldBorder, HangingFlowers, Mandala
    ui/                  Reveal, SectionHeading, ScrollLink
  hooks/                 useCountdown, useMediaQuery
  lib/                   calendar.ts (Google Calendar URLs + .ics generation)
  types/                 wedding.ts
  data/                  wedding.ts  ← edit this
```

## Design system

Colours, fonts, shadows and animations are declared as Tailwind v4 theme tokens in
`src/app/globals.css` under `@theme`, so they are available as ordinary utilities
(`bg-maroon-700`, `text-gold-300`, `font-script`, …).

Palette: deep maroon, royal red, rose pink, peach, marigold orange, gold, cream and
green accents. Fonts: Cormorant Garamond (headings), Marcellus (labels), Great Vibes
(script), Mukta (body).

Reusable composite classes: `.btn-royal`, `.btn-outline-gold`, `.glass-card`,
`.glass-card-dark`, `.gold-frame`, `.gold-text`, `.festive-text`, `.eyebrow`,
`.pattern-mandala`, `.pattern-diamond`.

## Notes on behaviour

- **Motion** — every animation is CSS-driven and disabled under
  `prefers-reduced-motion: reduce`; `FloatingPetals` renders nothing at all in that case.
- **Countdown** — backed by `useSyncExternalStore`, renders `--` placeholders during SSR
  to avoid hydration mismatch, and shows a wedding-day message instead of negative values.
- **Gallery lightbox** — arrow keys, Escape, touch swipe, focus trap, and focus returned
  to the thumbnail that opened it.
- **Decorations** — all decorative SVG is `aria-hidden` and `pointer-events-none`, and
  every section is `overflow-hidden` so ornaments never cause horizontal scrolling.
