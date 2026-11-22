<?php
// Rows for the Analytics page charts (ember-website/izzycharts/charts.js).
//   api/charts.php?chart=trajectories  -> renderTrajectories  [{video_id, title, day, views}]
//   api/charts.php?chart=heatmap       -> renderHeatmap       [{weekday, hour, videos}]
//   api/charts.php?chart=controversy   -> renderControversy   [{video_id, title, views, comment_rate, dislike_share}]
// Readable copies of these queries live in ember-website/izzycharts/queries.sql. Keep the two in sync.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Table holding the Kaggle "Trending YouTube Video Statistics" US data.
// CHANGE THIS if the table in Mfcarlin_youtubetrending has a different name.
const VIDEOS_TABLE = 'USvideos';

// Written to run on MySQL 5.7+, MySQL 8 and MariaDB (no CTEs or window functions).
// trending_date is text 'yy.dd.mm'; publish_time is ISO text '2017-11-13T17:13:01.000Z'.
$QUERIES = [
    // View trajectories for the 8 most-viewed official trailers
    'trajectories' => "
        SELECT t.video_id,
               MAX(t.title) AS title,
               DATEDIFF(STR_TO_DATE(t.trending_date, '%y.%d.%m'), top8.first_td) AS day,
               MAX(t.views) AS views
        FROM {table} t
        JOIN (
            SELECT video_id,
                   MIN(STR_TO_DATE(trending_date, '%y.%d.%m')) AS first_td,
                   MAX(views) AS peak
            FROM {table}
            WHERE title REGEXP 'official.*(trailer|teaser)'
            GROUP BY video_id
            ORDER BY peak DESC
            LIMIT 8
        ) top8 ON top8.video_id = t.video_id
        WHERE t.title REGEXP 'official.*(trailer|teaser)'
        GROUP BY t.video_id, t.trending_date, top8.first_td
        ORDER BY t.video_id, day",

    // Unique trending videos by publish weekday (0 = Mon) and hour (UTC)
    'heatmap' => "
        SELECT WEEKDAY(STR_TO_DATE(LEFT(publish_time, 19), '%Y-%m-%dT%H:%i:%s')) AS weekday,
               HOUR(STR_TO_DATE(LEFT(publish_time, 19), '%Y-%m-%dT%H:%i:%s'))    AS hour,
               COUNT(DISTINCT video_id) AS videos
        FROM {table}
        WHERE STR_TO_DATE(LEFT(publish_time, 19), '%Y-%m-%dT%H:%i:%s') IS NOT NULL
        GROUP BY weekday, hour
        ORDER BY weekday, hour",

    // Controversy map for the 400 most-viewed videos
    'controversy' => "
        SELECT video_id,
               MAX(title) AS title,
               MAX(views) AS views,
               ROUND(MAX(comment_count) / MAX(views) * 100, 3) AS comment_rate,
               ROUND(MAX(dislikes) / NULLIF(MAX(likes) + MAX(dislikes), 0) * 100, 2) AS dislike_share
        FROM {table}
        GROUP BY video_id
        HAVING MAX(views) > 0
        ORDER BY views DESC
        LIMIT 400",
];

$chart = $_GET['chart'] ?? '';
if (!isset($QUERIES[$chart])) {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown chart. Use one of: ' . implode(', ', array_keys($QUERIES))]);
    exit;
}

require __DIR__ . '/config.php'; // defines $mysqli

$result = $mysqli->query(str_replace('{table}', VIDEOS_TABLE, $QUERIES[$chart]));
if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => $mysqli->error]);
    exit;
}

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode($rows);
