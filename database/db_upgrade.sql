USE `foreststay_db`;

-- Drop tables if they exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `trek_bookings`;
DROP TABLE IF EXISTS `treks`;
DROP TABLE IF EXISTS `visitor_passes`;
DROP TABLE IF EXISTS `cafe_orders`;
SET FOREIGN_KEY_CHECKS = 1;

-- Cafe Orders Table
CREATE TABLE `cafe_orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `items_json` TEXT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed Cafe POS orders for today (Total: ₹1,062 to match screenshot)
INSERT INTO `cafe_orders` (`id`, `items_json`, `total_amount`, `created_at`) VALUES
(1, '[{"name":"Filter Coffee","qty":2,"price":120},{"name":"Woodfired Pizza","qty":1,"price":450}]', 690.00, CURRENT_TIMESTAMP),
(2, '[{"name":"Forest Berry Tea","qty":1,"price":150},{"name":"Spiced Garlic Bread","qty":1,"price":222}]', 372.00, CURRENT_TIMESTAMP);

-- Visitor Passes Table
CREATE TABLE `visitor_passes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `visitor_name` VARCHAR(255) NOT NULL,
  `pass_type` ENUM('adult', 'child', 'foreigner') NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed Visitor Passes for today (Total: ₹3,375 to match screenshot)
INSERT INTO `visitor_passes` (`id`, `visitor_name`, `pass_type`, `quantity`, `price`, `created_at`) VALUES
(1, 'Group of Friends', 'adult', 9, 1350.00, CURRENT_TIMESTAMP),
(2, 'Tourists Group', 'foreigner', 3, 1500.00, CURRENT_TIMESTAMP),
(3, 'Family Outing', 'child', 7, 525.00, CURRENT_TIMESTAMP);

-- Treks Table
CREATE TABLE `treks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `guide_name` VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

INSERT INTO `treks` (`id`, `title`, `duration`, `price`, `guide_name`) VALUES
(1, 'Pine Canopy Guided Walk', '2 hours', 400.00, 'Arun Kumar'),
(2, 'Ridge Sunset Expedition', '4 hours', 850.00, 'Vijay Singh'),
(3, 'Deep Forest Waterfall Trek', '6 hours', 1500.00, 'Arun Kumar');

-- Trek Bookings Table
CREATE TABLE `trek_bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `trek_id` INT NOT NULL,
  `participants` INT NOT NULL,
  `booking_date` DATE NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`trek_id`) REFERENCES `treks`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `trek_bookings` (`user_id`, `trek_id`, `participants`, `booking_date`, `total_price`) VALUES
(2, 1, 2, '2026-08-15', 800.00),
(3, 2, 1, '2026-08-16', 850.00);

-- Inventory Table
CREATE TABLE `inventory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `item_name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(50) NOT NULL,
  `min_required` DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB;

INSERT INTO `inventory` (`id`, `item_name`, `code`, `quantity`, `unit`, `min_required`) VALUES
(1, 'Hardwood BBQ Coal', 'i-04', 4.00, 'kg', 10.00), -- BBQ Coal matches low stock warning!
(2, 'Organic Coffee Beans', 'i-01', 12.50, 'kg', 5.00),
(3, 'Firewood Bundles', 'i-02', 3.00, 'packs', 15.00), -- Also low stock!
(4, 'Liquid Soap Dispenser', 'i-05', 25.00, 'liters', 10.00);

-- Staff Table
CREATE TABLE `staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `status` ENUM('active', 'off-duty') DEFAULT 'active'
) ENGINE=InnoDB;

INSERT INTO `staff` (`id`, `name`, `role`, `status`) VALUES
(1, 'Arun Kumar', 'Nature Guide', 'active'),
(2, 'Vijay Singh', 'Trek Leader', 'active'),
(3, 'Chef Mary', 'Kitchen Head', 'active'),
(4, 'David R.', 'Frontdesk Ops', 'active'),
(5, 'Suresh K.', 'Housekeeper', 'off-duty');
