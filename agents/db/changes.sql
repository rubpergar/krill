-- DB change log
-- Entries in chronological order (oldest first).

[TASK-001] Initial schema: categories and products tables
Date: 2026-05-27
Forward:
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT 'datetime(''now'')' NOT NULL,
	`updated_at` text DEFAULT 'datetime(''now'')' NOT NULL
);
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`sku` text NOT NULL,
	`description` text,
	`category_id` integer,
	`stock` integer DEFAULT 0 NOT NULL,
	`min_stock` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT 'datetime(''now'')' NOT NULL,
	`updated_at` text DEFAULT 'datetime(''now'')' NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);
Rollback:
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
