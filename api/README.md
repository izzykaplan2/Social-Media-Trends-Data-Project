# JSON data endpoints

PHP pages that query the class database and return JSON for the grids and charts.
These need a PHP server (the class server), not GitHub Pages.

## Setup
Copy `config.example.php` to `config.php` and put in the database password (ask Izzy).
`config.php` is gitignored.

## Endpoints
### `genres.php`
One object per genre, sorted by average engagement.

| field | meaning |
|---|---|
| genre | movie genre |
| trailer_count | trailers in that genre |
| total_views / avg_views | views summed / averaged |
| total_likes, total_comments | summed |
| avg_engagement_rate | mean of each trailer's (likes + comments) / views × 100 |
| pooled_engagement_rate | genre totals: (all likes + all comments) / all views × 100 |

```js
fetch('api/genres.php').then(r => r.json()).then(data => console.log(data));
```

### `search-trailers.php`

Used by `ember-website/index.html`. A GET request with `?search=Rampage` returns up to 50 matching rows from `Movie_trailers`, ordered by views. The fields are `video_id`, `title`, `channel_title`, `views`, `likes`, `comment_count`, and `trending_date`. This endpoint preserves separate trending-date snapshots of the same video.

Upload both the `api/` and `ember-website/` folders to the same PHP website, keeping them beside each other. Create `api/config.php` on that server from the connection example and use the verified database host, username, password, and exact database name `mfcarlin_youtubetrending`. The screenshot showed the username `mfcarlin_group2_users`. Confirm the host with the team because a server-side PHP connection may use a different host from DataGrip. The config must define `$mysqli`.

Test `api/search-trailers.php?search=Rampage` in the browser first. It should return a JSON array. Then open `ember-website/index.html` on that same PHP website and search for Rampage. An empty search returns an empty array. PHP and the live database have not been tested from the local development environment.

### `charts.php?chart=…`
Rows for the three charts on `ember-website/analytics.html`, rendered by `ember-website/izzycharts/charts.js`.
Reads from the table set in `VIDEOS_TABLE` at the top of the file (default `USvideos`, the Kaggle US trending data).

| `chart=` | rows | renderer |
|---|---|---|
| `trajectories` | video_id, title, day, views (8 most-viewed official trailers) | `renderTrajectories` |
| `heatmap` | weekday (0 = Mon), hour (UTC), videos | `renderHeatmap` |
| `controversy` | video_id, title, views, comment_rate, dislike_share (400 most-viewed videos) | `renderControversy` |

```js
fetch('../api/charts.php?chart=heatmap').then(r => r.json()).then(rows => console.log(rows));
```
