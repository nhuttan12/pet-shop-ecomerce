ALTER TABLE `customer-rating` MODIFY COLUMN `star_rated` int NOT NULL;--> statement-breakpoint
ALTER TABLE `customer-rating` ADD `status` enum('active','removed') DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `customer-rating` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `customer-rating` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;