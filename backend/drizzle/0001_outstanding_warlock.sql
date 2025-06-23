ALTER TABLE `stripe_payment_intents` DROP FOREIGN KEY `stripe_payment_intents_order_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `stripe_payment_intents` ADD CONSTRAINT `stripe_payment_intents_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;