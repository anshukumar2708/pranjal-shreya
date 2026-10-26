The couple's photographs. Everything here is wired up from `src/data/wedding.ts`
as `/images/<file>` — no component references a filename directly. Each folder
holds the photos for one section of the page.

## Folders

| Folder | Section | Data field |
| --- | --- | --- |
| `banner/` | Full-screen slideshow at the top of the page | `banner` |
| `couple/groom/` | Groom's collage in "The Bride & Groom" (first file is the large frame) | `groom.gallery` |
| `couple/bride/` | Bride's collage in "The Bride & Groom" (first file is the large frame) | `bride.gallery` |
| `ceremonies/` | The five ceremony cards — see [its README](ceremonies/README.md) | `events[].image` |
| `placeholder.svg` | Marigold "photograph coming soon" card | Automatic fallback when an image fails to load |

`boat-lake.jpg` appears in both `banner/` and `couple/groom/` on purpose, so
each folder stays self-contained.

Photos for the hidden sections (hero, couple cards, story, family, gallery,
venues) were removed. Restore them from git history if those sections are
switched back on.

## Adding or swapping photos

Resize to about 2400px on the long edge before adding — camera originals are
far too heavy for the page. Drop the file in the section's folder and point at
it from `src/data/wedding.ts`. Set a `focus` (a CSS `object-position`, e.g.
`"50% 30%"`) alongside the `src` so faces survive the crop; for the banner, it
decides which slice of a landscape photo a phone screen shows.
