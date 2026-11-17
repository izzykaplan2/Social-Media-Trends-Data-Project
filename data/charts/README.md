# Chart data (JSON)

Each chart on the site is one JSON file in this folder. Edit the numbers here and the chart on
the page updates — no HTML or JavaScript changes needed. Files marked `"placeholder": true`
show a "Sample data" badge on the site; delete that line once the numbers are real.

## Chart file format

```json
{
  "title": "Daily active users by platform",
  "subtitle": "Millions, 2019–2025",
  "type": "line",
  "x_label": "Year",
  "y_label": "Users (millions)",
  "labels": ["2019", "2020", "2021"],
  "series": [
    { "name": "TikTok",    "values": [100, 300, 600] },
    { "name": "Instagram", "values": [900, 1000, 1200] }
  ],
  "source": "Where the numbers came from",
  "placeholder": true
}
```

- `type`: `line`, `bar`, `hbar` (horizontal bar), `stacked` (stacked bar), `pie`, or `doughnut`.
- `labels`: the x-axis categories (or pie slices).
- `series`: one entry per line/bar group. Each `values` list must be the same length as `labels`.
  Pie/doughnut use only the first series.

## Stat file format (`headline-stats.json`)

```json
{ "stats": [ { "value": "4.9B", "label": "people use social media" } ] }
```

## Putting a chart on a page

```html
<figure class="chart" data-chart="../data/charts/my-chart.json"></figure>
```

(Use `data/charts/...` without `../` on `index.html`.)

## Workflow

`data/raw/` → cleaning code in `scripts/` or `notebooks/` → `data/processed/` → export the
numbers you want to show into a JSON file here.
