The couple's photographs. Everything here is wired up from `src/data/wedding.ts`
as `/images/<file>` — no component references a filename directly.

## What each photo is used for

| File | Subject | Used in |
| --- | --- | --- |
| `groom-portrait.jpg` | Groom, square face crop of `8.jpeg` | Hero circle, couple card, family tree |
| `bride-portrait.jpg` | Bride, square face crop of `3.jpeg` | Hero circle, couple card, family tree |
| `1.jpeg` | Couple, casual outdoors | Gallery |
| `2.jpeg` | Couple, casual outdoors | Gallery |
| `3.jpeg` | Bride solo, studio portrait | Bride showcase, gallery |
| `4.jpeg` | Bride solo, mirror — **the only landscape shot** | Gallery (short cell) |
| `5.jpeg` | Bride at the ceremony rituals | Haldi card, bride showcase, gallery |
| `6.jpeg` | *Unused* — it is a 3-photo collage, so it reads as a mistake inside a grid of single photos. Split it into separate files to use it. | — |
| `7.jpeg` | Couple entering through the smoke | Barat card, groom showcase, gallery |
| `8.jpeg` | Groom solo, full length | Groom showcase hero, gallery |
| `9.jpeg` | Couple walking between the guests | Reception card, bride showcase, gallery |
| `10.jpeg` | Bouquet under the floral arch | Venue card, gallery |
| `11.jpeg` | Couple laughing together — the strongest couple shot | Gallery lead, groom showcase |
| `12.jpeg` | Bride solo, before the ceremony | Mehendi card, bride showcase hero, gallery |
| `13.jpeg` | Couple laughing, close up | Groom showcase, gallery |
| `placeholder.svg` | Marigold "photograph coming soon" card | Automatic fallback when an image fails to load |

## Adding or swapping photos

Drop the file here and point at it from `src/data/wedding.ts`. Because most of
these photographs are tall and the layout crops them into circles, 16:10 cards
and masonry cells, set a `focus` (a CSS `object-position`, e.g. `"50% 30%"`)
alongside the `src` so the faces survive the crop. Lower percentages keep more
of the top of the frame.

The relatives on the family cards are still `i.pravatar.cc` placeholders — no
photographs of them were supplied.
