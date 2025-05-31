ALTER TABLE `products` RENAME COLUMN `dícount` TO `discount`;--> statement-breakpoint
ALTER TABLE `cart_details` MODIFY COLUMN `status` enum('active','removed') NOT NULL;--> statement-breakpoint
ALTER TABLE `carts` MODIFY COLUMN `status` enum('active','removed') NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `price` int NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `status` enum('active','inactive','removed') NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `stocking` int NOT NULL;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `feature`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `total_price`;