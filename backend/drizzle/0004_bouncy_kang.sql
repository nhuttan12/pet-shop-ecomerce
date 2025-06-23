ALTER TABLE `stripe_prices` DROP FOREIGN KEY `stripe_prices_product_id_stripe_products_id_fk`;
--> statement-breakpoint
ALTER TABLE `stripe_prices` MODIFY COLUMN `amount` int;--> statement-breakpoint
ALTER TABLE `stripe_prices` MODIFY COLUMN `interval` varchar(50);--> statement-breakpoint
ALTER TABLE `stripe_prices` ADD `stripe_product_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `stripe_products` ADD `product_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `stripe_prices` ADD CONSTRAINT `stripe_prices_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stripe_products` ADD CONSTRAINT `stripe_products_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;