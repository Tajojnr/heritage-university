CREATE TABLE `admissionApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(32) NOT NULL,
	`applicantName` varchar(160) NOT NULL,
	`programme` varchar(160) NOT NULL,
	`faculty` varchar(160) NOT NULL,
	`status` enum('draft','submitted','under_review','approved','rejected') NOT NULL DEFAULT 'draft',
	`submittedAt` timestamp,
	`decisionAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admissionApplications_id` PRIMARY KEY(`id`),
	CONSTRAINT `admissionApplications_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `enrollmentRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentNumber` varchar(64) NOT NULL,
	`academicSession` varchar(16) NOT NULL,
	`faculty` varchar(160) NOT NULL,
	`programme` varchar(160) NOT NULL,
	`level` varchar(32) NOT NULL,
	`status` enum('active','pending','withdrawn') NOT NULL DEFAULT 'pending',
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enrollmentRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
