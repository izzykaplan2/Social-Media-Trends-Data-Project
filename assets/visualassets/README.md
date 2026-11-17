# Visual assets — drop zone for the graphic design team

Every image on the site is pulled from this folder. **To place an asset, export it with the
exact filename below and drop it in the matching folder.** No HTML editing needed — the page
picks it up automatically. Until a file exists, the site shows a labeled dashed box in its place.

Any of these formats work (checked in this order): `.svg`, `.webp`, `.png`, `.jpg`.
So `hero/hero.png` and `hero/hero.jpg` both fill the `hero/hero` slot.

| Slot (folder/name)        | Where it appears              | Suggested size     |
|---------------------------|-------------------------------|--------------------|
| `brand/logo`              | Header, every page            | 160 × 40, SVG best |
| `hero/hero`               | Home page, top                | 1600 × 900         |
| `sections/finding-1`      | Findings page, Finding 1      | 1200 × 675         |
| `sections/finding-2`      | Findings page, Finding 2      | 1200 × 675         |
| `sections/finding-3`      | Findings page, Finding 3      | 1200 × 675         |
| `sections/data-methods`   | Data & Methods page, top      | 1200 × 400         |
| `team/team`               | About page                    | 1200 × 800         |

Keep files under ~500 KB (compress at squoosh.app or TinyPNG).

## Adding a new slot

Ask whoever is editing the HTML to add:

```html
<figure class="asset-slot" data-src="../assets/visualassets/sections/my-new-graphic"
        data-label="My new graphic" data-size="1200 × 675"></figure>
```

then add a row to the table above.
