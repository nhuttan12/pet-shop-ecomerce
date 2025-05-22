ALTER TABLE `wishlists` ADD `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE `wishlists`
 ADD CONSTRAINT `wishlists_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`), 
 ADD CONSTRAINT `wishlists_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);