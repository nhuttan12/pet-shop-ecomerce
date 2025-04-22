CREATE TABLE `roles` (
	`id` int NOT NULL,
	`name` varchar(45) NOT NULL,
	`statusId` int NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `status` (
	`id` int NOT NULL,
	`name` varchar(45) NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int NOT NULL,
	`username` varchar(45) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(100),
	`email` varchar(100) NOT NULL,
	`phone` varchar(10) NOT NULL,
	`adresss` varchar(255),
	`role_id` int NOT NULL,
	`status_id` int NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
ALTER TABLE `roles` ADD CONSTRAINT `roles_statusId_status_id_fk` FOREIGN KEY (`statusId`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_status_id_status_id_fk` FOREIGN KEY (`status_id`) REFERENCES `status`(`id`) ON DELETE no action ON UPDATE no action;