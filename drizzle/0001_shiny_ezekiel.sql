CREATE TABLE `guidedDemoIntakes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(40) NOT NULL,
	`status` enum('queued','presented') NOT NULL DEFAULT 'queued',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guidedDemoIntakes_id` PRIMARY KEY(`id`),
	CONSTRAINT `guidedDemoIntakes_reference_unique` UNIQUE(`reference`)
);
