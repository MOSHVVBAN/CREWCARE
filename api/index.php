<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_user(bool $keepSessionOpen = false): int {
    if (empty($_SESSION['user_id'])) {
        respond(['success' => false, 'message' => 'Authentication required. Please sign in.'], 401);
    }
    $uid = (int)$_SESSION['user_id'];
    if (!$keepSessionOpen && session_status() === PHP_SESSION_ACTIVE) {
        session_write_close();
    }
    return $uid;
}

function clean_string($value, int $max = 500): string {
    $value = trim((string)($value ?? ''));
    return mb_substr($value, 0, $max);
}

function get_protocol(int $code): array {
    if ($code === 2) {
        return [
            "Abort EVA missions immediately and enter the shielded storm shelter.",
            "Enforce mandatory rest protocol and suspend non-critical operations.",
            "Administer radioprotectants and sleep-aid medication from the medical kit."
        ];
    } elseif ($code === 1) {
        return [
            "Increase cabin ventilation to clear CO2 pockets and inspect scrubbers.",
            "Consume 500 ml electrolyte hydration and wear compression garments.",
            "Schedule a mandatory 30-minute rest break and pause strenuous tasks."
        ];
    }
    return [
        "All telemetry nominal. Continue scheduled flight tasks."
    ];
}

function evaluate_crew_risk(array $telemetry): array {
    $gradioUrl = 'https://moshvvban-crewcare-ai.hf.space/gradio_api/call/predict';

    $gradioPayload = json_encode([
        'data' => [
            (float)$telemetry['heart_rate'],
            (float)$telemetry['sleep_hours'],
            (float)$telemetry['spo2'],
            (float)$telemetry['radiation_level'],
            (float)$telemetry['cabin_co2'],
            (float)$telemetry['comm_delay'],
        ]
    ]);

    if (function_exists('curl_init')) {
        // 1. Trigger Gradio inference job
        $ch = curl_init($gradioUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $gradioPayload,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 15,
        ]);
        $initResp = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($initResp !== false && $httpCode === 200) {
            $initData = json_decode($initResp, true);
            $eventId = $initData['event_id'] ?? null;

            if ($eventId) {
                // 2. Fetch SSE result from Gradio
                $ch2 = curl_init($gradioUrl . '/' . urlencode($eventId));
                curl_setopt_array($ch2, [
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_CONNECTTIMEOUT => 5,
                    CURLOPT_TIMEOUT => 15,
                ]);
                $streamResp = curl_exec($ch2);
                curl_close($ch2);

                if ($streamResp && preg_match('/^data:\s*(\[.*\])/m', $streamResp, $matches)) {
                    $parsed = json_decode($matches[1], true);
                    if (isset($parsed[0]) && is_array($parsed[0]) && isset($parsed[0]['status_code'])) {
                        return $parsed[0];
                    }
                }
            }
        }
    }

    // Compound Hazard Risk Engine Fallback (synchronized with ML features)
    $hr   = (float)$telemetry['heart_rate'];
    $slp  = (float)$telemetry['sleep_hours'];
    $spo2 = (float)$telemetry['spo2'];
    $rad  = (float)$telemetry['radiation_level'];
    $co2  = (float)$telemetry['cabin_co2'];
    $temp = (float)($telemetry['temperature'] ?? 36.8);

    $code = 0;
    $triggers = [];

    if ($hr >= 115 || $hr <= 45 || $spo2 < 90 || $rad >= 2.5 || $co2 >= 1.0 || $temp >= 38.5 || ($hr >= 105 && $slp <= 4.0 && $rad >= 1.5)) {
        $code = 2;
    } elseif ($hr >= 95 || $hr <= 52 || $spo2 < 94 || $slp < 5.5 || $rad >= 1.0 || $co2 >= 0.5 || $temp >= 37.6) {
        $code = 1;
    }

    if ($hr >= 95) $triggers[] = "Elevated Heart Rate ({$hr} bpm)";
    if ($spo2 < 94) $triggers[] = "Low SpO2 ({$spo2}%)";
    if ($slp < 5.5) $triggers[] = "Sleep Deficit ({$slp} hrs)";
    if ($rad >= 1.0) $triggers[] = "Elevated Radiation ({$rad} mSv/day)";
    if ($co2 >= 0.5) $triggers[] = "High Cabin CO2 ({$co2}%)";
    if ($temp >= 37.6) $triggers[] = "Elevated Temp ({$temp}°C)";

    $labels = [0 => 'Normal', 1 => 'Warning', 2 => 'Critical'];
    $colors = [0 => 'green', 1 => 'yellow', 2 => 'red'];

    return [
        'status_code'     => $code,
        'status_label'    => $labels[$code],
        'indicator_color' => $colors[$code],
        'comm_delay'      => (float)$telemetry['comm_delay'],
        'triggers'        => $triggers,
        'actions'         => get_protocol($code)
    ];
}
function create_auto_alert(PDO $pdo, int $uid, array $risk, array $telemetry): void {
    if (($risk['status_code'] ?? 0) === 0) return;

    $isCritical = ((int)$risk['status_code'] === 2);
    $severity = $isCritical ? 'urgent' : 'review';
    $title = $isCritical
        ? 'CRITICAL COMPOUND HAZARD DETECTED'
        : 'Telemetry Warning: Threshold Exceeded';

    $summary = sprintf(
        "HR: %s bpm | SpO2: %s%% | Sleep: %s hrs | Rad: %s mSv/d | CO2: %s%% | Comm Delay: %s min.",
        $telemetry['heart_rate'],
        $telemetry['spo2'],
        $telemetry['sleep_hours'],
        $telemetry['radiation_level'],
        $telemetry['cabin_co2'],
        $telemetry['comm_delay']
    );

    if (!empty($risk['triggers'])) {
        $summary .= " Triggers: " . implode(', ', $risk['triggers']) . ".";
    }

    $protocolText = implode(' ', $risk['actions'] ?? []);

    $stmt = $pdo->prepare('INSERT INTO alerts (user_id, title, description, protocol, severity) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$uid, $title, $summary, $protocolText, $severity]);
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$data = body();

try {
    switch ($action) {
        case 'register':
            if ($method !== 'POST') respond(['success' => false, 'message' => 'Method not allowed'], 405);
            $name = clean_string($data['name'] ?? '', 120);
            $email = strtolower(clean_string($data['email'] ?? '', 190));
            $password = (string)($data['password'] ?? '');

            if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
                respond(['success' => false, 'message' => 'Please enter a valid name, email, and a password of at least 8 characters.'], 422);
            }

            $check = $pdo->prepare('SELECT id FROM users WHERE email = ?');
            $check->execute([$email]);
            if ($check->fetch()) {
                respond(['success' => false, 'message' => 'This email address is already registered.'], 409);
            }

            $stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
            $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);

            session_regenerate_id(true);
            $_SESSION['user_id'] = (int)$pdo->lastInsertId();
            $_SESSION['user_name'] = $name;

            respond([
                'success' => true,
                'message' => 'Account created successfully.',
                'user' => ['id' => $_SESSION['user_id'], 'name' => $name, 'email' => $email]
            ], 201);

        case 'login':
            if ($method !== 'POST') respond(['success' => false, 'message' => 'Method not allowed'], 405);
            $email = strtolower(clean_string($data['email'] ?? '', 190));
            $password = (string)($data['password'] ?? '');

            $stmt = $pdo->prepare('SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1');
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, $user['password'])) {
                respond(['success' => false, 'message' => 'Invalid email or password.'], 401);
            }

            session_regenerate_id(true);
            $_SESSION['user_id'] = (int)$user['id'];
            $_SESSION['user_name'] = $user['name'];

            respond([
                'success' => true,
                'message' => 'Signed in successfully.',
                'user' => ['id' => (int)$user['id'], 'name' => $user['name'], 'email' => $user['email']]
            ]);

        case 'logout':
            if ($method !== 'POST' && $method !== 'GET') respond(['success' => false, 'message' => 'Method not allowed'], 405);
            $_SESSION = [];
            if (ini_get('session.use_cookies')) {
                $p = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', $p['secure'], $p['httponly']);
            }
            session_destroy();
            respond(['success' => true, 'message' => 'Signed out successfully.']);

        case 'me':
            $uid = require_user();
            $stmt = $pdo->prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
            $stmt->execute([$uid]);
            $user = $stmt->fetch();
            if (!$user) respond(['success' => false, 'message' => 'User account not found.'], 404);
            $user['id'] = (int)$user['id'];
            respond(['success' => true, 'user' => $user]);

        case 'measurements':
            $uid = require_user();
            if ($method === 'GET') {
                $stmt = $pdo->prepare('SELECT *, recorded_at AS created_at FROM measurements WHERE user_id = ? ORDER BY id DESC LIMIT 100');
                $stmt->execute([$uid]);
                respond(['success' => true, 'measurements' => $stmt->fetchAll()]);
            }
            if ($method === 'POST') {
                $type = clean_string($data['type'] ?? '', 80);
                $value = clean_string($data['value'] ?? '', 80);
                $unit = clean_string($data['unit'] ?? '', 30);
                $notes = clean_string($data['notes'] ?? '', 1000);

                $allowedTypes = ['Heart Rate', 'Blood Pressure', 'Temperature', 'SpO2', 'Radiation', 'Cabin CO2'];
                if (!in_array($type, $allowedTypes, true) || $value === '' || !is_numeric($value)) {
                    respond(['success' => false, 'message' => 'Please enter a valid numeric measurement value.'], 422);
                }

                $stmt = $pdo->prepare('INSERT INTO measurements (user_id, type, value, unit, notes) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$uid, $type, $value, $unit, $notes]);

                $telemetry = [
                    'heart_rate'      => ($type === 'Heart Rate') ? (float)$value : 72.0,
                    'spo2'            => ($type === 'SpO2') ? (float)$value : 98.0,
                    'temperature'     => ($type === 'Temperature') ? (float)$value : 36.8,
                    'sleep_hours'     => 7.0,
                    'radiation_level' => ($type === 'Radiation') ? (float)$value : 0.35,
                    'cabin_co2'       => ($type === 'Cabin CO2') ? (float)$value : 0.04,
                    'comm_delay'      => 1.3
                ];
                $risk = evaluate_crew_risk($telemetry);
                create_auto_alert($pdo, $uid, $risk, $telemetry);

                respond([
                    'success' => true,
                    'message' => 'Measurement saved successfully.',
                    'id' => (int)$pdo->lastInsertId(),
                    'risk' => $risk
                ], 201);
            }
            respond(['success' => false, 'message' => 'Method not allowed'], 405);

        case 'daily-check':
            $uid = require_user();
            if ($method === 'GET') {
                $stmt = $pdo->prepare('SELECT * FROM daily_checks WHERE user_id = ? ORDER BY id DESC LIMIT 50');
                $stmt->execute([$uid]);
                respond(['success' => true, 'checks' => $stmt->fetchAll()]);
            }
            if ($method === 'POST') {
                $fields = ['heart_rate', 'spo2', 'temperature', 'systolic', 'diastolic', 'glucose', 'radiation_level', 'cabin_co2', 'comm_delay', 'sleep_hours'];
                $values = [];
                foreach ($fields as $field) {
                    $v = $data[$field] ?? null;
                    if ($v === '' || $v === null) {
                        $values[$field] = null;
                    } elseif (!is_numeric($v)) {
                        respond(['success' => false, 'message' => "Invalid numeric value for {$field}."], 422);
                    } else {
                        $values[$field] = (float)$v;
                    }
                }
                $notes = clean_string($data['notes'] ?? '', 2000);
                $notMeasured = !empty($data['glucose_not_measured']) ? 1 : 0;

                $telemetry = [
                    'heart_rate'      => $values['heart_rate'] ?? 72.0,
                    'spo2'            => $values['spo2'] ?? 98.0,
                    'temperature'     => $values['temperature'] ?? 36.8,
                    'sleep_hours'     => $values['sleep_hours'] ?? 7.4,
                    'radiation_level' => $values['radiation_level'] ?? 0.35,
                    'cabin_co2'       => $values['cabin_co2'] ?? 0.04,
                    'comm_delay'      => $values['comm_delay'] ?? 1.3
                ];

                $risk = evaluate_crew_risk($telemetry);

                $stmt = $pdo->prepare('INSERT INTO daily_checks (user_id, heart_rate, spo2, temperature, systolic, diastolic, glucose, glucose_not_measured, radiation_level, cabin_co2, comm_delay, risk_status, risk_color, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([
                    $uid,
                    $values['heart_rate'],
                    $values['spo2'],
                    $values['temperature'],
                    $values['systolic'],
                    $values['diastolic'],
                    $values['glucose'],
                    $notMeasured,
                    $values['radiation_level'],
                    $values['cabin_co2'],
                    $values['comm_delay'],
                    $risk['status_label'],
                    $risk['indicator_color'],
                    $notes
                ]);

                if ($values['heart_rate'] !== null) {
                    $mStmt = $pdo->prepare('INSERT INTO measurements (user_id, type, value, unit, notes) VALUES (?, ?, ?, ?, ?)');
                    $mStmt->execute([$uid, 'Heart Rate', $values['heart_rate'], 'bpm', 'Daily health check']);
                }
                if ($values['spo2'] !== null) {
                    $mStmt = $pdo->prepare('INSERT INTO measurements (user_id, type, value, unit, notes) VALUES (?, ?, ?, ?, ?)');
                    $mStmt->execute([$uid, 'SpO2', $values['spo2'], '%', 'Daily health check']);
                }
                if ($values['temperature'] !== null) {
                    $mStmt = $pdo->prepare('INSERT INTO measurements (user_id, type, value, unit, notes) VALUES (?, ?, ?, ?, ?)');
                    $mStmt->execute([$uid, 'Temperature', $values['temperature'], '°C', 'Daily health check']);
                }

                create_auto_alert($pdo, $uid, $risk, $telemetry);

                respond([
                    'success' => true,
                    'message' => 'Daily health check evaluated and saved.',
                    'id' => (int)$pdo->lastInsertId(),
                    'risk' => $risk
                ], 201);
            }
            respond(['success' => false, 'message' => 'Method not allowed'], 405);

        case 'predict-risk':
            $uid = require_user();
            if ($method !== 'POST') respond(['success' => false, 'message' => 'Method not allowed'], 405);
            $telemetry = [
                'heart_rate'      => isset($data['heart_rate']) && is_numeric($data['heart_rate']) ? (float)$data['heart_rate'] : 72.0,
                'spo2'            => isset($data['spo2']) && is_numeric($data['spo2']) ? (float)$data['spo2'] : 98.0,
                'temperature'     => isset($data['temperature']) && is_numeric($data['temperature']) ? (float)$data['temperature'] : 36.8,
                'sleep_hours'     => isset($data['sleep_hours']) && is_numeric($data['sleep_hours']) ? (float)$data['sleep_hours'] : 7.4,
                'radiation_level' => isset($data['radiation_level']) && is_numeric($data['radiation_level']) ? (float)$data['radiation_level'] : 0.35,
                'cabin_co2'       => isset($data['cabin_co2']) && is_numeric($data['cabin_co2']) ? (float)$data['cabin_co2'] : 0.04,
                'comm_delay'      => isset($data['comm_delay']) && is_numeric($data['comm_delay']) ? (float)$data['comm_delay'] : 1.3
            ];
            $risk = evaluate_crew_risk($telemetry);
            respond(['success' => true, 'risk' => $risk]);

        case 'wellness':
            $uid = require_user();
            if ($method === 'GET') {
                $stmt = $pdo->prepare('SELECT * FROM wellness_checkins WHERE user_id = ? ORDER BY id DESC LIMIT 100');
                $stmt->execute([$uid]);
                respond(['success' => true, 'wellness' => $stmt->fetchAll()]);
            }
            if ($method === 'POST') {
                $sleep = $data['sleep_hours'] ?? null;
                $quality = clean_string($data['sleep_quality'] ?? '', 50);
                $mood = clean_string($data['mood'] ?? '', 80);
                $stress = $data['stress_level'] ?? null;
                $notes = clean_string($data['notes'] ?? '', 1000);

                $stmt = $pdo->prepare('INSERT INTO wellness_checkins (user_id, sleep_hours, sleep_quality, mood, stress_level, notes) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([
                    $uid,
                    ($sleep === '' ? null : $sleep),
                    ($quality === '' ? null : $quality),
                    ($mood === '' ? null : $mood),
                    ($stress === '' ? null : $stress),
                    ($notes === '' ? null : $notes)
                ]);

                $latestCheckStmt = $pdo->prepare('SELECT * FROM daily_checks WHERE user_id = ? ORDER BY id DESC LIMIT 1');
                $latestCheckStmt->execute([$uid]);
                $latestCheck = $latestCheckStmt->fetch() ?: [];

                $telemetry = [
                    'heart_rate'      => isset($latestCheck['heart_rate']) && $latestCheck['heart_rate'] !== null ? (float)$latestCheck['heart_rate'] : 72.0,
                    'spo2'            => isset($latestCheck['spo2']) && $latestCheck['spo2'] !== null ? (float)$latestCheck['spo2'] : 98.0,
                    'temperature'     => isset($latestCheck['temperature']) && $latestCheck['temperature'] !== null ? (float)$latestCheck['temperature'] : 36.8,
                    'sleep_hours'     => is_numeric($sleep) ? (float)$sleep : 7.4,
                    'radiation_level' => isset($latestCheck['radiation_level']) && $latestCheck['radiation_level'] !== null ? (float)$latestCheck['radiation_level'] : 0.35,
                    'cabin_co2'       => isset($latestCheck['cabin_co2']) && $latestCheck['cabin_co2'] !== null ? (float)$latestCheck['cabin_co2'] : 0.04,
                    'comm_delay'      => isset($latestCheck['comm_delay']) && $latestCheck['comm_delay'] !== null ? (float)$latestCheck['comm_delay'] : 1.3
                ];
                $risk = evaluate_crew_risk($telemetry);
                create_auto_alert($pdo, $uid, $risk, $telemetry);

                respond([
                    'success' => true,
                    'message' => 'Wellness check-in saved.',
                    'id' => (int)$pdo->lastInsertId(),
                    'risk' => $risk
                ], 201);
            }
            respond(['success' => false, 'message' => 'Method not allowed'], 405);

        case 'tasks':
            $uid = require_user();
            if ($method === 'GET') {
                $stmt = $pdo->prepare('SELECT * FROM routine_tasks WHERE user_id = ? ORDER BY id ASC');
                $stmt->execute([$uid]);
                $tasks = $stmt->fetchAll();

                if (count($tasks) === 0) {
                    $defaults = [
                        ['Morning measurements', 'Log vitals and cabin telemetry', '07:30', 0],
                        ['Resistance exercise', 'ARED lower and upper body protocol', '10:00', 0],
                        ['Hydration check', '500ml electrolyte intake', '11:30', 0],
                        ['Afternoon check-in', 'Mid-day SpO2 and CO2 verification', '14:00', 0],
                        ['Evening wellness review', 'Sleep and stress assessment', '20:00', 0],
                    ];
                    $ins = $pdo->prepare('INSERT INTO routine_tasks (user_id, title, description, due_at, is_done) VALUES (?, ?, ?, ?, ?)');
                    foreach ($defaults as $d) {
                        $ins->execute([$uid, $d[0], $d[1], $d[2], $d[3]]);
                    }
                    $stmt->execute([$uid]);
                    $tasks = $stmt->fetchAll();
                }

                respond(['success' => true, 'tasks' => $tasks]);
            }
            if ($method === 'POST') {
                $title = clean_string($data['title'] ?? '', 180);
                if ($title === '') respond(['success' => false, 'message' => 'Task title is required.'], 422);

                $dueAt = clean_string($data['due_at'] ?? '', 50);
                $stmt = $pdo->prepare('INSERT INTO routine_tasks (user_id, title, description, due_at) VALUES (?, ?, ?, ?)');
                $stmt->execute([
                    $uid,
                    $title,
                    clean_string($data['description'] ?? '', 1000),
                    ($dueAt === '' ? null : $dueAt)
                ]);
                respond(['success' => true, 'message' => 'Reminder added successfully.', 'id' => (int)$pdo->lastInsertId()], 201);
            }
            if ($method === 'PATCH') {
                $id = (int)($data['id'] ?? 0);
                $done = !empty($data['is_done']) ? 1 : 0;
                $stmt = $pdo->prepare('UPDATE routine_tasks SET is_done = ? WHERE id = ? AND user_id = ?');
                $stmt->execute([$done, $id, $uid]);
                respond(['success' => true, 'message' => 'Task status updated.']);
            }
            respond(['success' => false, 'message' => 'Method not allowed'], 405);

        case 'alerts':
            $uid = require_user();
            if ($method === 'GET') {
                $stmt = $pdo->prepare('SELECT * FROM alerts WHERE user_id = ? ORDER BY id DESC');
                $stmt->execute([$uid]);
                respond(['success' => true, 'alerts' => $stmt->fetchAll()]);
            }
            if ($method === 'POST') {
                $title = clean_string($data['title'] ?? '', 180);
                $description = clean_string($data['description'] ?? ($data['message'] ?? ''), 2000);
                $protocol = clean_string($data['protocol'] ?? '', 1000);
                $severity = clean_string($data['severity'] ?? 'info', 20);
                if (!in_array($severity, ['info', 'review', 'urgent'], true)) $severity = 'info';

                if ($title === '') respond(['success' => false, 'message' => 'Alert title is required.'], 422);

                $stmt = $pdo->prepare('INSERT INTO alerts (user_id, title, description, protocol, severity) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$uid, $title, $description, $protocol, $severity]);
                respond(['success' => true, 'message' => 'Alert logged.', 'id' => (int)$pdo->lastInsertId()], 201);
            }
            respond(['success' => false, 'message' => 'Method not allowed'], 405);

        case 'alerts-review':
            $uid = require_user();
            if ($method !== 'PATCH') respond(['success' => false, 'message' => 'Method not allowed'], 405);
            $id = (int)($data['id'] ?? 0);
            $stmt = $pdo->prepare('UPDATE alerts SET is_reviewed = 1 WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $uid]);
            respond(['success' => true, 'message' => 'Alert marked as reviewed.']);

        case 'settings':
            $uid = require_user();
            if ($method === 'GET') {
                $stmt = $pdo->prepare('SELECT settings_json FROM user_settings WHERE user_id = ?');
                $stmt->execute([$uid]);
                $row = $stmt->fetch();
                respond(['success' => true, 'settings' => $row ? json_decode($row['settings_json'], true) : new stdClass()]);
            }
            if ($method === 'PUT') {
                $json = json_encode($data, JSON_UNESCAPED_UNICODE);
                $stmt = $pdo->prepare('INSERT INTO user_settings (user_id, settings_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE settings_json = VALUES(settings_json)');
                $stmt->execute([$uid, $json]);
                respond(['success' => true, 'message' => 'Settings saved successfully.', 'settings' => $data]);
            }
            respond(['success' => false, 'message' => 'Method not allowed'], 405);

        case 'profile':
            $uid = require_user(true);
            if ($method === 'PUT') {
                $name = clean_string($data['name'] ?? '', 120);
                $email = strtolower(clean_string($data['email'] ?? '', 190));
                $password = (string)($data['password'] ?? '');
                if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    respond(['success' => false, 'message' => 'Please enter a valid name and email address.'], 422);
                }
                $checkEmail = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
                $checkEmail->execute([$email, $uid]);
                if ($checkEmail->fetch()) {
                    respond(['success' => false, 'message' => 'This email is already in use by another account.'], 409);
                }
                if ($password !== '' && strlen($password) < 8) {
                    respond(['success' => false, 'message' => 'New password must be at least 8 characters.'], 422);
                }
                if ($password !== '') {
                    $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?');
                    $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT), $uid]);
                } else {
                    $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
                    $stmt->execute([$name, $email, $uid]);
                }
                $_SESSION['user_name'] = $name;
                respond(['success' => true, 'message' => 'Profile updated successfully.']);
            }
            respond(['success' => false, 'message' => 'Method not allowed'], 405);

        default:
            respond(['success' => false, 'message' => 'API action not found.'], 404);
    }
} catch (Throwable $e) {
    error_log('SpaceCare API error: ' . $e->getMessage());
    respond(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}