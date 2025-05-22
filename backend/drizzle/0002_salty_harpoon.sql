ALTER TABLE `images` RENAME COLUMN `product_id` TO `folder`;--> statement-breakpoint
ALTER TABLE `images` RENAME COLUMN `name` TO `resource_type`;--> statement-breakpoint
ALTER TABLE `images` DROP FOREIGN KEY `images_product_id_products_id_fk`;
--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `resource_type` varchar(50);--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `folder` varchar(255);--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `url` text NOT NULL;--> statement-breakpoint
ALTER TABLE `images` ADD `created_at` varchar(100);--> statement-breakpoint
ALTER TABLE `images` ADD `width` varchar(20);--> statement-breakpoint
ALTER TABLE `images` ADD `height` varchar(20);--> statement-breakpoint
ALTER TABLE `images` ADD `bytes` varchar(20);--> statement-breakpoint
ALTER TABLE `images` ADD `related_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `images` ADD `related_type` varchar(50) NOT NULL;