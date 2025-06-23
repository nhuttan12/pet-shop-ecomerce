ALTER TABLE `categories` MODIFY COLUMN `image_id` int;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `title` varchar(255) NOT NULL;