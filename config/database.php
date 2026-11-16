<?php
// XAMPP defaults. Change these values if your MySQL credentials differ.
$DB_HOST = 'sql202.infinityfree.com';
$DB_NAME = 'if0_43438573_crewcare';
$DB_USER = 'if0_43438573';
$DB_PASS = 'JuvCz6o3w0Tix';

try {
    $pdo = new PDO(
        "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed. Check config/database.php and MySQL service.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}