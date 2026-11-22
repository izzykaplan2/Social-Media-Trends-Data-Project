<?php
// Return matching trailer snapshots as JSON for the homepage search.
header('Content-Type: application/json; charset=utf-8');

$search = $_GET['search'] ?? '';

if (!is_string($search) || strlen($search) > 500) {
    http_response_code(400);
    echo json_encode(['error' => 'Enter a search of 500 bytes or fewer.']);
    exit;
}

$search = trim($search);

if ($search === '') {
    echo '[]';
    exit;
}

if (!is_file(__DIR__ . '/config.php')) {
    http_response_code(503);
    echo json_encode(['error' => 'The database connection has not been configured.']);
    exit;
}

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    require __DIR__ . '/config.php'; // Uses the project's existing $mysqli connection.
    $mysqli->set_charset('utf8mb4');

    // LOCATE finds the search text anywhere in a title.
    // Keep the input separate from the SQL using a prepared statement.
    // Repeated video IDs are snapshots, identified by trending_date.
    $sql = "SELECT video_id, title, channel_title, views, likes,
                   comment_count, trending_date
            FROM `Movie_trailers`
            WHERE LOCATE(?, title) > 0
            ORDER BY views DESC, video_id ASC, trending_date ASC,
                     channel_title ASC, likes DESC, comment_count DESC
            LIMIT 50";

    $statement = $mysqli->prepare($sql);
    $statement->bind_param('s', $search);
    $statement->execute();
    $result = $statement->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $statement->close();
    echo json_encode($data, JSON_INVALID_UTF8_SUBSTITUTE);
} catch (mysqli_sql_exception $error) {
    http_response_code(500);
    echo json_encode(['error' => 'The trailer search is temporarily unavailable.']);
}
