# scripts

Analysis and data-cleaning code (e.g. Python). Read from `../data/raw/`, write to `../data/processed/`.

To put numbers on the site, export them as JSON into `../data/charts/` using the format in
`../data/charts/README.md`. For example, in Python:

```python
import json
chart = {
    "title": "Daily active users by platform",
    "type": "line",
    "labels": df["year"].astype(str).tolist(),
    "series": [{"name": col, "values": df[col].tolist()} for col in ["TikTok", "Instagram"]],
    "source": "Pew Research Center, 2025",
}
json.dump(chart, open("../data/charts/finding-1.json", "w"), indent=2)
```
