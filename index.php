<?php
require_once __DIR__ . '/config/session.php';
if (empty($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CREWCARE | Health Monitoring</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="css/base-layout.css">
    <link rel="stylesheet" href="css/overview-dashboard.css">
    <link rel="stylesheet" href="css/inner-pages.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
<div class="dashboard">
    <!-- SIDEBAR -->
    <aside class="sidebar" id="sidebar">
        <div class="logo">
            <div class="logo-icon">
                <i class="fa-solid fa-heart-pulse"></i>
            </div>
            <div>
                <h2>CREWCARE</h2>
                <span>CREW HEALTH SYSTEM</span>
            </div>
        </div>
        <div class="menu-section">
            <p class="section-title">MISSION HEALTH</p>
            <a href="#overview" class="menu-link active">
                <i class="fa-solid fa-grip"></i>
                <span>Overview</span>
            </a>
            <a href="#daily-check" class="menu-link">
                <i class="fa-regular fa-clipboard"></i>
                <span>Daily Health Check</span>
            </a>
            <a href="#analytics" class="menu-link">
                <i class="fa-solid fa-chart-line"></i>
                <span>Health Analytics</span>
            </a>
            <a href="#body-map" class="menu-link">
                <i class="fa-solid fa-person"></i>
                <span>Human Body Map</span>
            </a>
            <a href="#alerts" class="menu-link">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Alerts & Actions</span>
                <span class="notification-count">1</span>
            </a>
            <a href="#wellness" class="menu-link">
                <i class="fa-solid fa-moon"></i>
                <span>Sleep & Mental Wellness</span>
            </a>
        </div>
        <div class="menu-section">
            <p class="section-title">RESOURCES & SYSTEM</p>
            <a href="#guide" class="menu-link">
                <i class="fa-solid fa-book-open"></i>
                <span>Space Health Guide</span>
            </a>
            <a href="#routine" class="menu-link">
                <i class="fa-regular fa-clock"></i>
                <span>Mission Routine</span>
            </a>
            <a href="#settings" class="menu-link">
                <i class="fa-solid fa-gear"></i>
                <span>Settings</span>
            </a>
        </div>
        <div class="sidebar-bottom">
            <div class="crew-card">
                <div class="avatar">LE</div>
                <div>
                    <h4>Lunar Exploration</h4>
                    <p>Mission Day 084</p>
                </div>
            </div>
            <p class="demo-label">
                <i class="fa-solid fa-shield-halved"></i>
                DEMONSTRATION ONLY
            </p>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content" id="appMain">
        <!-- TOPBAR -->
        <header class="topbar">
            <div class="breadcrumb">
                CREWCARE <i class="fa-solid fa-chevron-right"></i> Overview
            </div>
            <div class="topbar-right">
                <div class="env-selector-wrap" style="display: flex; align-items: center; gap: 8px; background: var(--bg-card); border: 1px solid var(--border-color); padding: 6px 10px; border-radius: var(--radius-md);">
                    <i class="fa-solid fa-shuttle-space" style="color: var(--primary); font-size: 12px;"></i>
                    <select id="missionEnvironmentSelect" title="Mission Environment" style="background: transparent; color: var(--text-primary); border: none; outline: none; font-size: 11px; font-weight: 600; cursor: pointer;">
                        <option value="spacecraft" style="background: var(--bg-card); color: var(--text-primary);">Spacecraft (LEO)</option>
                        <option value="iss" style="background: var(--bg-card); color: var(--text-primary);">Space Station (ISS)</option>
                        <option value="lunar" style="background: var(--bg-card); color: var(--text-primary);">Lunar Base (Artemis)</option>
                        <option value="mars" style="background: var(--bg-card); color: var(--text-primary);">Mars Transit (Deep Space)</option>
                    </select>
                </div>
                <div class="sync-status">
                    <i class="fa-solid fa-wifi"></i>
                    <div>
                        <strong>Data synchronized</strong>
                        <small>Simulated · Just now</small>
                    </div>
                </div>
                <button class="icon-button" id="notificationBtn">
                    <i class="fa-regular fa-bell"></i>
                    <span class="bell-dot"></span>
                </button>
                <div class="profile">
                    <div class="profile-avatar">EC</div>
                    <div>
                        <strong>Elena Cruz</strong>
                        <small>Commander</small>
                    </div>
                </div>
                <button class="primary-button" id="logoutBtn" title="Log Out" style="background: rgba(240, 100, 100, 0.12); color: #f06464; border: 1px solid rgba(240, 100, 100, 0.3); margin-left: 10px;">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Log Out</span>
                </button>
                <button class="mobile-menu" id="mobileMenu">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </header>

        <?php include __DIR__ . '/pages/overview.php'; ?>
        <?php include __DIR__ . '/pages/daily-check.php'; ?>
        <?php include __DIR__ . '/pages/analytics.php'; ?>
        <?php include __DIR__ . '/pages/body-map.php'; ?>
        <?php include __DIR__ . '/pages/alerts.php'; ?>
        <?php include __DIR__ . '/pages/wellness.php'; ?>
        <?php include __DIR__ . '/pages/guide.php'; ?>
        <?php include __DIR__ . '/pages/routine.php'; ?>
        <?php include __DIR__ . '/pages/settings.php'; ?>
    </main>
</div>

<script src="api-client.js"></script>
<script src="session-guard.js"></script>
<script src="js/core-navigation.js"></script>
<script src="js/risk-engine.js"></script>
<script src="js/dashboard-sync.js"></script>
<script src="js/interactions.js"></script>
</body>
</html>