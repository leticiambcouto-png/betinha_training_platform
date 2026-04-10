CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`icon` varchar(64) NOT NULL,
	`color` varchar(32),
	`condition` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`),
	CONSTRAINT `badges_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trailId` int NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(256) NOT NULL,
	`subtitle` varchar(256),
	`description` text,
	`orderIndex` int NOT NULL DEFAULT 0,
	`pointsReward` int NOT NULL DEFAULT 100,
	`bonusPoints` int NOT NULL DEFAULT 50,
	`deadlineDays` int DEFAULT 3,
	`isActive` boolean NOT NULL DEFAULT true,
	`isComingSoon` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`answers` json NOT NULL,
	`score` float NOT NULL,
	`passed` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`question` text NOT NULL,
	`options` json NOT NULL,
	`correctIndex` int NOT NULL,
	`explanation` text,
	`orderIndex` int NOT NULL DEFAULT 0,
	`isAiGenerated` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `slides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`orderIndex` int NOT NULL DEFAULT 0,
	`title` varchar(256),
	`content` text NOT NULL,
	`betinhaSpeech` text,
	`imageUrl` varchar(512),
	`layout` enum('default','highlight','list','quote','image-left','image-right','full-image') NOT NULL DEFAULT 'default',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`icon` varchar(64),
	`color` varchar(32),
	`isActive` boolean NOT NULL DEFAULT true,
	`orderIndex` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trails_id` PRIMARY KEY(`id`),
	CONSTRAINT `trails_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeId` int NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`trailId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`currentSlide` int NOT NULL DEFAULT 0,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`quizScore` float,
	`quizAttempts` int NOT NULL DEFAULT 0,
	`pointsEarned` int NOT NULL DEFAULT 0,
	`bonusEarned` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `jobTitle` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `admissionDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `totalPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `level` int DEFAULT 1 NOT NULL;