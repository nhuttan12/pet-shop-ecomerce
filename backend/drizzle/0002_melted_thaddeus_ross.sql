CREATE TABLE `post_edit_request` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`employee_id` int NOT NULL,
	`status` enum('pending','approved','rejected','done') NOT NULL DEFAULT 'pending',
	`content_suggested` text,
	`reason` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`resolved_at` timestamp,
	CONSTRAINT `post_edit_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `posts` ADD `has_pending_edit_request` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `post_edit_request` ADD CONSTRAINT `post_edit_request_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_edit_request` ADD CONSTRAINT `post_edit_request_employee_id_users_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;