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
