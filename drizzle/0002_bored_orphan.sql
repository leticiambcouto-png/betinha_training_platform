CREATE TABLE `chapters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`profileType` enum('todos','clt','pj','lideranca') NOT NULL DEFAULT 'todos',
	`orderIndex` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chapters_id` PRIMARY KEY(`id`),
	CONSTRAINT `chapters_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `modules` ADD CONSTRAINT `modules_slug_unique` UNIQUE(`slug`);