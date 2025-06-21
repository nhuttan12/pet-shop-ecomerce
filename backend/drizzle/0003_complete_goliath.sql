CREATE TABLE `post_report` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` int NOT NULL,
	`status` enum('pending','reviewed','removed') NOT NULL DEFAULT 'pending',
	`description` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_report_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `post_report` ADD CONSTRAINT `post_report_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_report` ADD CONSTRAINT `post_report_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;