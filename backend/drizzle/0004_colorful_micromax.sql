ALTER TABLE `brands` ADD `status` enum('active','inactive','removed');--> statement-breakpoint
ALTER TABLE `categories` DROP COLUMN `description`;