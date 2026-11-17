# Social Media Trends

ACAD 274 · Group 2

A data project exploring trends in social media usage, published with GitHub Pages.
upload image assets into assets subfolder
**Live site:** https://izzykaplan2.github.io/Social-Media-Trends-Data-Project/ (after Pages is enabled)

## Structure

```
.
├── index.html          # Home page
├── pages/              # Other site pages (findings, data & methods, about)
├── assets/
│   ├── css/style.css   # Site styles
│   ├── js/main.js      # Site script
│   └── images/         # Photos and exported charts
├── data/
│   ├── raw/            # Original datasets
│   └── processed/      # Cleaned datasets
├── scripts/            # Analysis / cleaning code
├── notebooks/          # Jupyter notebooks
└── .nojekyll           # Serve files as-is (skip Jekyll)
```

## Publishing

1. Push to `main`.
2. On GitHub: **Settings → Pages → Build and deployment**, set Source to *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The site appears at the URL above within a minute or two.

## Previewing locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.
