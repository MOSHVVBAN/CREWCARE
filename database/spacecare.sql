-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2026 at 08:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `spacecare`
-- --------------------------------------------------------

-- Table structure for table `alerts`
CREATE TABLE `alerts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(160) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `protocol` varchar(1000) DEFAULT NULL,
  `severity` enum('info','review','urgent') NOT NULL DEFAULT 'info',
  `is_reviewed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `alerts`
INSERT INTO `alerts` (`id`, `user_id`, `title`, `description`, `protocol`, `severity`, `is_reviewed`, `created_at`) VALUES
(1, 1, 'Routine Telemetry Calibration Check', 'Initial spacecraft environmental sensors and crew biometric baselines are active and synchronized.', 'All telemetry nominal. Continue scheduled flight tasks.', 'info', 0, '2026-11-13 08:00:00');

-- --------------------------------------------------------

-- Table structure for table `daily_checks`
CREATE TABLE `daily_checks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `heart_rate` decimal(8,2) DEFAULT NULL,
  `spo2` decimal(5,2) DEFAULT NULL,
  `temperature` decimal(6,2) DEFAULT NULL,
  `systolic` decimal(8,2) DEFAULT NULL,
  `diastolic` decimal(8,2) DEFAULT NULL,
  `glucose` decimal(8,2) DEFAULT NULL,
  `glucose_not_measured` tinyint(1) NOT NULL DEFAULT 0,
  `radiation_level` decimal(8,2) DEFAULT NULL,
  `cabin_co2` decimal(8,2) DEFAULT NULL,
  `comm_delay` decimal(8,2) DEFAULT NULL,
  `risk_status` varchar(30) DEFAULT 'Normal',
  `risk_color` varchar(20) DEFAULT 'green',
  `notes` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `daily_checks`
INSERT INTO `daily_checks` (`id`, `user_id`, `heart_rate`, `spo2`, `temperature`, `systolic`, `diastolic`, `glucose`, `glucose_not_measured`, `radiation_level`, `cabin_co2`, `comm_delay`, `risk_status`, `risk_color`, `notes`, `created_at`) VALUES
(1, 1, 72.00, 98.00, 36.80, 118.00, 76.00, 92.00, 0, 0.35, 0.04, 1.30, 'Normal', 'green', 'Baseline nominal check', '2026-11-12 20:00:35');

-- --------------------------------------------------------

-- Table structure for table `measurements`
CREATE TABLE `measurements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(80) NOT NULL,
  `value` decimal(12,3) NOT NULL,
  `unit` varchar(30) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `measurements`
INSERT INTO `measurements` (`id`, `user_id`, `type`, `value`, `unit`, `notes`, `recorded_at`) VALUES
(1, 1, 'Heart Rate', 72.000, 'bpm', 'Morning check', '2026-11-12 20:01:04'),
(2, 1, 'SpO2', 98.000, '%', 'Pulse oximeter', '2026-11-12 20:01:20'),
(3, 1, 'Temperature', 36.800, '°C', 'Tympanic sensor', '2026-11-12 20:01:46');

-- --------------------------------------------------------

-- Table structure for table `routine_tasks`
CREATE TABLE `routine_tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `due_at` varchar(50) DEFAULT NULL,
  `is_done` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `routine_tasks`
INSERT INTO `routine_tasks` (`id`, `user_id`, `title`, `description`, `due_at`, `is_done`, `created_at`) VALUES
(1, 1, 'Morning measurements', 'Log vitals and cabin telemetry', '07:30', 1, '2026-11-13 07:30:00'),
(2, 1, 'Resistance exercise', 'ARED lower and upper body protocol', '10:00', 1, '2026-11-13 10:00:00'),
(3, 1, 'Hydration check', '500ml electrolyte intake', '11:30', 1, '2026-11-13 11:30:00'),
(4, 1, 'Afternoon check-in', 'Mid-day SpO2 and CO2 verification', '14:00', 0, '2026-11-13 12:00:00'),
(5, 1, 'Evening wellness review', 'Sleep and stress assessment', '20:00', 0, '2026-11-13 12:05:00');

-- --------------------------------------------------------

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'habiba faisal rashwan', 'habiba@gmail.com', '$2y$10$YO1u8fzWTutBd8OhxyKR0OgAdgNddK2luO/qg4IAvBVvX4GhMqEiW', '2026-11-12 13:46:32');

-- --------------------------------------------------------

-- Table structure for table `user_settings`
CREATE TABLE `user_settings` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `settings_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`settings_json`)),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `user_settings`
INSERT INTO `user_settings` (`user_id`, `settings_json`, `updated_at`) VALUES
(1, '{"unit_system":"Mission standard"}', '2026-11-12 21:25:43');

-- --------------------------------------------------------

-- Table structure for table `wellness_checkins`
CREATE TABLE `wellness_checkins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `sleep_hours` decimal(4,2) DEFAULT NULL,
  `sleep_quality` varchar(30) DEFAULT NULL,
  `mood` varchar(30) DEFAULT NULL,
  `stress_level` tinyint(3) UNSIGNED DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `wellness_checkins`
INSERT INTO `wellness_checkins` (`id`, `user_id`, `sleep_hours`, `sleep_quality`, `mood`, `stress_level`, `notes`, `created_at`) VALUES
(1, 1, 7.40, 'Good', 'Steady', 2, 'Nominal sleep cycle', '2026-11-13 07:00:00');

-- Indexes for dumped tables
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`created_at`);

ALTER TABLE `daily_checks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`created_at`);

ALTER TABLE `measurements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`recorded_at`);

ALTER TABLE `routine_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`due_at`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `wellness_checkins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`created_at`);

-- AUTO_INCREMENT for dumped tables
ALTER TABLE `alerts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `daily_checks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `measurements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `routine_tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `wellness_checkins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

-- Constraints for dumped tables
ALTER TABLE `alerts`
  ADD CONSTRAINT `fk_alerts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `daily_checks`
  ADD CONSTRAINT `fk_daily_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `measurements`
  ADD CONSTRAINT `fk_measurements_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `routine_tasks`
  ADD CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `user_settings`
  ADD CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `wellness_checkins`
  ADD CONSTRAINT `fk_wellness_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;