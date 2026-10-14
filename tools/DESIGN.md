# STUDIO|BD: design plan

**Subject:** an AIGC brand-content practice. **Audience:** brand and marketing leads at furniture, auto, jewelry and FMCG brands.
**Primary job:** in five seconds, show that this person directs real brand work and renders it with AI. Then route visitors to the work and to contact.

## The one memorable thing
The hero shows BD's portrait. Under the cursor, a lens reveals the *same pose rendered as a marble statue*: the human directs and the machine renders.
The source images (BD01/BD02) are pixel-aligned, so the reveal is seamless. On touch devices the lens drifts across the face on its own. With reduced motion, it stays fixed on the face.

## Colour (taken from the work, not a stock palette)
| Token | Hex | Role |
|---|---|---|
| Ink | `#000000` | True black, matching the portrait and film backgrounds exactly |
| Marble | `#DEDBD5` | The statue's stone. Text on dark, background of light sections |
| Stone | `#A29D95` | Secondary text on dark |
| Graphite | `#57534E` | Secondary text on marble |
| Oxblood | `#6E0D15` | Taken from BD's red portrait backdrop. Used as a **full section field** (About), never as a small accent |

## Type
A single family, **Archivo variable** (width axis 62–125, weight 100–900), self-hosted.
- Display: width 62 (extra-condensed), weight 800, leading 0.84. Names and titles set huge.
- Text: width 100, weight 400, 18/27. Statements: width 88, weight 500.
- The width axis is the type idea. On load, the hero name *settles* from wide and thin into condensed and heavy, like a render resolving. On hover, project titles in the work list stretch wider. These are the only two places where type moves.

## Layout (left-aligned throughout, on a 12-column fluid gutter)
```
HERO   [ portrait + statue lens, full-bleed ]
       small line: what I do              hint: move to reveal
       S T U D I O | B D  (fills the width, bottom-anchored)
INTRO  (marble) one statement paragraph, then 4 services in a row
WORK   (ink) 9 rows: giant condensed title ........ type / role
       a floating preview follows the cursor (desktop), a thumbnail on mobile
REEL   (ink) a sticky film that opens from an inset frame to full-bleed as you scroll
LAB    (marble) masonry of concepts between projects
ABOUT  (oxblood) red portrait | bio + a 4-step process (a real sequence, so numbered)
CONTACT(ink) a giant line plus email
CASE   title / facts / cover film / lead / blocks (films, browser frame, phones, grids) / next project
```

## Principles
- Spend the boldness in the hero. Everything else stays quiet: no scattered fade-ups, no card shadows, no all-caps eyebrows, no arrows appended to links, no fake stats.
- Show the work honestly: client sites are credited as led by BD; E8, Ride at Dawn and BAODAN are labelled self-initiated or studio brand.
- Motion either answers the visitor (lens, hover stretch, page wipe, sound toggle) or happens once on load.
- Built to a quality floor: responsive to 360 px, keyboard focus visible, `prefers-reduced-motion` respected, videos lazy and muted until asked.

## Review against defaults (what I changed)
- My first instinct was near-black with a single neon red accent. That's a generic default. I **changed** it to true black, marble and oxblood used as whole fields, all taken from BD's own images.
- My first instinct for the hero was a big headline with a stat row. I **changed** it to the human-to-statue lens, which only this client can have.
- I **dropped** a loader and a custom cursor. The lens already is the cursor moment.
