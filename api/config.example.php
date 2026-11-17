<?php
// Copy this file to config.php and fill in the real password.
// config.php is gitignored so the password never lands in this public repo.
$mysqli = new mysqli('localhost', 'group2_users', 'YOUR_PASSWORD_HERE', 'Mfcarlin_youtubetrending');
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}
$mysqli->set_charset('utf8mb4');
