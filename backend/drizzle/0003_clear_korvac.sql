CREATE TABLE `product-images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`image_id` int NOT NULL,
	`url` text NOT NULL,
	`folder` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product-images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `images` RENAME COLUMN `resource_type` TO `type`;--> statement-breakpoint
ALTER TABLE `images` RENAME COLUMN `width` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `type` enum('product','thumbnail','banner','avatar','store_logo','review','category','promotion','blog','slider');--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `categories` ADD `image_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user_details` ADD `image_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `product-images` ADD CONSTRAINT `product-images_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product-images` ADD CONSTRAINT `product-images_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_details` ADD CONSTRAINT `user_details_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `height`;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `bytes`;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `image_type`;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `related_id`;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `related_type`;