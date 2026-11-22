<?php
// Copy this file to config.php on the PHP server.
// Confirm the database host and credentials with the team.
// localhost applies when PHP and MySQL use the same server.
// config.php is gitignored so the password never lands in this public repo.
$mysqli = new mysqli('localhost', 'mfcarlin_group2_users', 'YOUR_PASSWORD_HERE', 'mfcarlin_youtubetrending');
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}
$mysqli->set_charset('utf8mb4');
