<?php
// Genre-level stats as JSON. Teammates: fetch('api/genres.php').then(r => r.json())
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/config.php'; // defines $mysqli

// TODO: swap table/column names for the real schema
$sql = "SELECT genre,
               COUNT(*) AS trailer_count,
               SUM(views) AS total_views,
               ROUND(AVG(views)) AS avg_views,
               SUM(likes) AS total_likes,
               SUM(comment_count) AS total_comments,
               ROUND(AVG((likes + comment_count) / NULLIF(views, 0) * 100), 2) AS avg_engagement_rate,
               ROUND((SUM(likes) + SUM(comment_count)) / NULLIF(SUM(views), 0) * 100, 2) AS pooled_engagement_rate
        FROM trailers
        WHERE genre IS NOT NULL AND genre <> ''
        GROUP BY genre
        ORDER BY avg_engagement_rate DESC";

$result = $mysqli->query($sql);
if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => $mysqli->error]);
    exit;
}

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = [
        'genre'                  => $row['genre'],
        'trailer_count'          => (int)$row['trailer_count'],
        'total_views'            => (int)$row['total_views'],
        'avg_views'              => (int)$row['avg_views'],
        'total_likes'            => (int)$row['total_likes'],
        'total_comments'         => (int)$row['total_comments'],
        'avg_engagement_rate'    => (float)$row['avg_engagement_rate'],
        'pooled_engagement_rate' => (float)$row['pooled_engagement_rate'],
    ];
}

echo json_encode($rows, JSON_PRETTY_PRINT);
