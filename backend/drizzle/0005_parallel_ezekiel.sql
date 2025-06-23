CREATE TABLE `product-rating` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`star_rated` int NOT NULL,
	`product_id` int NOT NULL,
	`status` enum('active','removed') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product-rating_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `customer-rating`;--> statement-breakpoint
ALTER TABLE `comments` MODIFY COLUMN `status` enum('active','inactive','removed') DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `product-rating` ADD CONSTRAINT `product-rating_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product-rating` ADD CONSTRAINT `product-rating_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;