-- ============================================================================
-- Joshi's Academy — Complete MySQL Database Schema
-- Standalone CMS & Website Content Management
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `joshisacademy` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `joshisacademy`;

-- ----------------------------------------------------------------------------
-- 1. CMS Admin Users Table
-- Dedicated CMS administrator accounts independent from student/teacher LMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_admin_users` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL DEFAULT 'CMS Administrator',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cms_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default administrator account (Default login: admin@joshisacademy.com / Admin@123)
INSERT INTO `cms_admin_users` (`id`, `email`, `password_hash`, `name`, `is_active`)
VALUES (
  'cms-admin-01',
  'admin@joshisacademy.com',
  '$2a$10$w82E/5SjP3p0Z6r2xM8e5uW3mR5kL7yP2qZ4wN1vB8cC0dE2fG3hI', -- Bcrypt hash
  'CMS Administrator',
  1
) ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);


-- ----------------------------------------------------------------------------
-- 2. Gallery Table
-- Campus photographs, classroom sessions, and infrastructure gallery
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` VARCHAR(36) NOT NULL,
  `academy_id` VARCHAR(64) NOT NULL DEFAULT 'default',
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` TEXT NOT NULL,
  `thumbnail_url` TEXT DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'General',
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gallery_academy` (`academy_id`),
  KEY `idx_gallery_published` (`is_published`),
  KEY `idx_gallery_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- 3. YouTube Channel Configuration Table
-- Channel metadata, sync status, and API credentials
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `youtube_channel_config` (
  `id` VARCHAR(36) NOT NULL DEFAULT 'default-channel',
  `academy_id` VARCHAR(64) NOT NULL DEFAULT 'default',
  `channel_id` VARCHAR(128) NOT NULL,
  `channel_handle` VARCHAR(128) DEFAULT NULL,
  `channel_url` VARCHAR(500) NOT NULL,
  `channel_name` VARCHAR(255) NOT NULL DEFAULT 'Joshi\'s Academy',
  `channel_thumbnail` VARCHAR(500) DEFAULT NULL,
  `subscriber_count` INT NOT NULL DEFAULT 0,
  `video_count` INT NOT NULL DEFAULT 0,
  `playlist_count` INT NOT NULL DEFAULT 0,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `auto_sync` TINYINT(1) NOT NULL DEFAULT 1,
  `sync_interval_hours` INT NOT NULL DEFAULT 6,
  `last_synced_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_yt_channel_academy` (`academy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- 4. YouTube Videos Table (Extended for Shorts & Channel Sync)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `youtube_videos` (
  `id` VARCHAR(36) NOT NULL,
  `academy_id` VARCHAR(64) NOT NULL DEFAULT 'default',
  `youtube_video_id` VARCHAR(64) NOT NULL,
  `channel_id` VARCHAR(128) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `youtube_url` VARCHAR(500) NOT NULL,
  `thumbnail_url` VARCHAR(500) DEFAULT NULL,
  `published_at` DATETIME DEFAULT NULL,
  `duration` VARCHAR(32) DEFAULT NULL,
  `content_type` ENUM('VIDEO', 'SHORT') NOT NULL DEFAULT 'VIDEO',
  `is_short` TINYINT(1) NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_yt_video_id` (`academy_id`, `youtube_video_id`),
  KEY `idx_yt_academy` (`academy_id`),
  KEY `idx_yt_type` (`content_type`),
  KEY `idx_yt_published` (`is_published`),
  KEY `idx_yt_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- 5. YouTube Playlists Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `youtube_playlists` (
  `id` VARCHAR(36) NOT NULL,
  `academy_id` VARCHAR(64) NOT NULL DEFAULT 'default',
  `playlist_id` VARCHAR(128) NOT NULL,
  `channel_id` VARCHAR(128) DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `thumbnail_url` VARCHAR(500) DEFAULT NULL,
  `video_count` INT NOT NULL DEFAULT 0,
  `published_at` DATETIME DEFAULT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_yt_playlist_id` (`academy_id`, `playlist_id`),
  KEY `idx_yt_pl_academy` (`academy_id`),
  KEY `idx_yt_pl_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- 6. YouTube Playlist Videos Mapping Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `youtube_playlist_videos` (
  `id` VARCHAR(36) NOT NULL,
  `academy_id` VARCHAR(64) NOT NULL DEFAULT 'default',
  `playlist_id` VARCHAR(128) NOT NULL,
  `video_id` VARCHAR(64) NOT NULL,
  `position` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_yt_pl_video` (`playlist_id`, `video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- 7. Google Review Configuration Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `google_review_config` (
  `id` VARCHAR(36) NOT NULL,
  `academy_id` VARCHAR(64) NOT NULL DEFAULT 'default',
  `google_place_id` VARCHAR(255) DEFAULT NULL,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `auto_refresh` TINYINT(1) NOT NULL DEFAULT 1,
  `max_reviews` INT NOT NULL DEFAULT 10,
  `min_rating` INT NOT NULL DEFAULT 4,
  `last_fetched_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_google_config_academy` (`academy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `google_review_config` (`id`, `academy_id`, `is_enabled`, `auto_refresh`, `max_reviews`, `min_rating`)
VALUES ('default-config', 'default', 1, 1, 10, 4)
ON DUPLICATE KEY UPDATE `academy_id` = VALUES(`academy_id`);


-- ----------------------------------------------------------------------------
-- 8. Google Review Cache Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `google_review_cache` (
  `id` VARCHAR(36) NOT NULL DEFAULT 'default-cache',
  `academy_id` VARCHAR(64) NOT NULL DEFAULT 'default',
  `place_id` VARCHAR(255) DEFAULT NULL,
  `place_name` VARCHAR(255) DEFAULT 'Joshi\'s Academy',
  `overall_rating` DECIMAL(3,2) DEFAULT 4.90,
  `total_reviews` INT DEFAULT 245,
  `review_data` JSON DEFAULT NULL,
  `last_fetched_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_google_cache_academy` (`academy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
