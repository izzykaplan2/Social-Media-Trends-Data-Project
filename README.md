# Social Media Trends

ACAD 274 · Group 2

A data project exploring trends in social media usage, published with GitHub Pages.

**Live site:** https://izzykaplan2.github.io/Social-Media-Trends-Data-Project/ (after Pages is enabled)

## Where things go

| You are…            | Put your files in…              | Instructions                                  |
|---------------------|---------------------------------|-----------------------------------------------|
| **Graphic design**  | `assets/visualassets/`          | [assets/visualassets/README.md](assets/visualassets/README.md) — exact filenames per slot |
| **Data**            | `data/charts/*.json`            | [data/charts/README.md](data/charts/README.md) — chart JSON format |
| **Writing**         | the `.html` pages               | Replace the placeholder text inside `<main>`  |

Empty design slots show a dashed box with the filename they expect. Charts using sample
numbers show a "Sample data" badge until `"placeholder": true` is removed from their JSON.

## Structure

```
.
├── index.html              # Home: hero, key stats, featured chart
├── pages/
│   ├── findings.html       # One section per finding (chart + graphic)
│   ├── data.html           # Sources, pipeline, methods
│   └── about.html          # Team
├── assets/
│   ├── css/style.css       # Styles + chart color palette (--chart-1…6)
│   ├── js/main.js          # Loads design assets, charts, stats
│   └── visualassets/       # ← DESIGN TEAM DROP ZONE
│       ├── brand/          #   logo
│       ├── hero/           #   home page hero
│       ├── sections/       #   per-finding graphics, page banners
│       └── team/           #   team photo
├── data/
│   ├── raw/                # Original datasets (don't edit)
│   ├── processed/          # Cleaned datasets
│   └── charts/             # ← JSON that powers every chart on the site
├── scripts/                # Analysis / cleaning code
├── notebooks/              # Jupyter notebooks
└── .nojekyll               # Serve files as-is (skip Jekyll)
```

Charts are drawn with [Chart.js](https://www.chartjs.org/) (loaded from a CDN).

## Publishing

1. Push to `main`.
2. On GitHub: **Settings → Pages → Build and deployment**, set Source to *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The site appears at the URL above within a minute or two.

## Previewing locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. (Charts need a server — opening the HTML file directly blocks the JSON.)
