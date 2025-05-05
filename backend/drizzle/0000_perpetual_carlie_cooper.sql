CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(45) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cart_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	`price` int NOT NULL,
	CONSTRAINT `cart_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`status_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories_mapping` (
	`product_id` int NOT NULL,
	`category_id` int NOT NULL,
	CONSTRAINT `categories_mapping_product_id_category_id_pk` PRIMARY KEY(`product_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(45),
	`description` varchar(255),
	`status_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50),
	`email` varchar(100),
	`title` varchar(255),
	`message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`user_id` int NOT NULL,
	`product_id` int NOT NULL,
	CONSTRAINT `favorites_user_id_product_id_pk` PRIMARY KEY(`user_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `image_types` (
	`id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `image_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(45) NOT NULL,
	`product_id` int NOT NULL,
	`url` text,
	`status_id` int NOT NULL,
	`image_type_id` int NOT NULL,
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventories` (
	`product_id` int NOT NULL,
	`stocking` int NOT NULL,
	CONSTRAINT `inventories_product_id` PRIMARY KEY(`product_id`)
);
--> statement-breakpoint
CREATE TABLE `order_details` (
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int,
	`price` int,
	`total_price` int,
	CONSTRAINT `order_details_order_id_product_id_pk` PRIMARY KEY(`order_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`total_invoice` int NOT NULL,
	`payment_method` int NOT NULL,
	`shipping_method` int NOT NULL,
	`status_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(45),
	`status_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pet_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(45),
	`status_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pet_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_pet_mapping` (
	`pet_type_id` int NOT NULL,
	`product_id` int NOT NULL,
	CONSTRAINT `product_pet_mapping_pet_type_id_product_id_pk` PRIMARY KEY(`pet_type_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`description` text,
	`price` int,
	`feature` text,
	`brand_id` int NOT NULL,
	`status_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(45) NOT NULL,
	`statusId` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shipping_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(45),
	`estimate_time` datetime,
	`status_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shipping_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(45) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(45) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(100),
	`email` varchar(100) NOT NULL,
	`phone` varchar(10) NOT NULL,
	`adresss` varchar(255),
	`role_id` int NOT NULL,
	`status_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_cart_id_carts_id_fk` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `carts` ADD CONSTRAINT `carts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `carts` ADD CONSTRAINT `carts_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories_mapping` ADD CONSTRAINT `categories_mapping_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories_mapping` ADD CONSTRAINT `categories_mapping_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_image_type_id_image_types_id_fk` FOREIGN KEY (`image_type_id`) REFERENCES `image_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_method_payment_methods_id_fk` FOREIGN KEY (`payment_method`) REFERENCES `payment_methods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_shipping_method_shipping_methods_id_fk` FOREIGN KEY (`shipping_method`) REFERENCES `shipping_methods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pet_types` ADD CONSTRAINT `pet_types_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_pet_mapping` ADD CONSTRAINT `product_pet_mapping_pet_type_id_pet_types_id_fk` FOREIGN KEY (`pet_type_id`) REFERENCES `pet_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_pet_mapping` ADD CONSTRAINT `product_pet_mapping_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_brand_id_brands_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roles` ADD CONSTRAINT `roles_statusId_status_id_fk` FOREIGN KEY (`statusId`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shipping_methods` ADD CONSTRAINT `shipping_methods_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;