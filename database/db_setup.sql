-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS `foreststay_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `foreststay_db`;

-- Drop tables if they exist (order is important due to foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `cabin_amenities`;
DROP TABLE IF EXISTS `amenities`;
DROP TABLE IF EXISTS `cabins`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- Users Table
-- Default password hash is for 'password123'
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Admin User', 'admin@foreststay.com', '$2a$10$Wd3fH6B/H.xG7cW2JzL4/Oe9M6yRzRFeCbeMhW5J.7Lw4Q1z/fXlS', 'admin'),
(2, 'John Doe', 'guest@foreststay.com', '$2a$10$Wd3fH6B/H.xG7cW2JzL4/Oe9M6yRzRFeCbeMhW5J.7Lw4Q1z/fXlS', 'user'),
(3, 'Sarah Connor', 'sarah@foreststay.com', '$2a$10$Wd3fH6B/H.xG7cW2JzL4/Oe9M6yRzRFeCbeMhW5J.7Lw4Q1z/fXlS', 'user');

-- Cabins Table
CREATE TABLE `cabins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price_per_night` DECIMAL(10,2) NOT NULL,
  `max_guests` INT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `rating` DECIMAL(3,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `cabins` (`id`, `name`, `description`, `price_per_night`, `max_guests`, `location`, `image_url`, `rating`) VALUES
(1, 'Silverwood A-Frame', 'A breathtaking mid-century A-frame nestled deep within a redwood forest. Features a modern minimalist interior, glass walls, a cedar hot tub, and a suspended fire pit. Perfect for couples looking for an intimate nature retreat.', 180.00, 2, 'Redwood National Park, CA', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200', 4.8),
(2, 'Fernwood Geodesic Dome', 'Immerse yourself in nature in this luxurious geodesic dome. Enjoy star-gazing through the panoramic transparent ceiling while staying cozy by the pellet stove. Fully equipped kitchen and outdoor deck with forest views.', 220.00, 4, 'Olympic Peninsula, WA', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200', 4.9),
(3, 'Pinecrest Luxury Lodge', 'A massive log home perfect for family gatherings or group retreats. Boasts 4 spacious bedrooms, a floor-to-ceiling stone fireplace, a fully equipped chef\'s kitchen, game room, and a massive wraparound deck overlooking the valley.', 390.00, 8, 'Blue Ridge Mountains, NC', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=1200', 4.7),
(4, 'Whispering Pines Cabin', 'A charming rustic cabin designed for comfort. Surrounded by towering ponderosa pines, it offers a peaceful covered porch, an open-concept loft, and immediate access to hiking trails and a nearby mountain stream.', 130.00, 3, 'Bend, OR', 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1200', 4.6),
(5, 'Mossy Creek Treehouse', 'Live out your childhood dream in this architecturally designed luxury treehouse. Suspended 15 feet off the forest floor, it features a suspension bridge entrance, wood-burning hot tub, and elegant modern interiors.', 290.00, 2, 'Smoky Mountains, TN', 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=1200', 4.95),
(6, 'Golden Hour Hideaway', 'A modern, sun-drenched container home built on a ridge. Expansive floor-to-ceiling windows catch the golden rays filtering through the birch canopy. Features a private fire pit area and premium design elements.', 160.00, 2, 'Catskills, NY', 'https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&q=80&w=1200', 4.75);

-- Amenities Table
CREATE TABLE `amenities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

INSERT INTO `amenities` (`id`, `name`, `icon`) VALUES
(1, 'High-Speed Wi-Fi', 'Wifi'),
(2, 'Private Cedar Hot Tub', 'Droplet'),
(3, 'Wood-burning Fireplace', 'Flame'),
(4, 'Fully Equipped Kitchen', 'Utensils'),
(5, 'Pet Friendly', 'Heart'),
(6, 'Panoramic Forest Views', 'Compass'),
(7, 'Air Conditioning', 'Wind'),
(8, 'Outdoor Fire Pit', 'Zap');

-- Cabin Amenities Junction Table
CREATE TABLE `cabin_amenities` (
  `cabin_id` INT,
  `amenity_id` INT,
  PRIMARY KEY (`cabin_id`, `amenity_id`),
  FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed amenities for cabins
-- Cabin 1: Wifi, Hot Tub, Fireplace, Kitchen, Forest Views, Fire pit
INSERT INTO `cabin_amenities` (`cabin_id`, `amenity_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 6), (1, 8);

-- Cabin 2: Wifi, Hot Tub, Kitchen, Forest Views, AC, Fire pit
INSERT INTO `cabin_amenities` (`cabin_id`, `amenity_id`) VALUES
(2, 1), (2, 2), (2, 4), (2, 6), (2, 7), (2, 8);

-- Cabin 3: Wifi, Hot Tub, Fireplace, Kitchen, Pet Friendly, Forest Views, AC, Fire pit
INSERT INTO `cabin_amenities` (`cabin_id`, `amenity_id`) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8);

-- Cabin 4: Fireplace, Kitchen, Pet Friendly, Forest Views, Fire pit
INSERT INTO `cabin_amenities` (`cabin_id`, `amenity_id`) VALUES
(4, 3), (4, 4), (4, 5), (4, 6), (4, 8);

-- Cabin 5: Wifi, Hot Tub, Fireplace, Forest Views, Fire pit
INSERT INTO `cabin_amenities` (`cabin_id`, `amenity_id`) VALUES
(5, 1), (5, 2), (5, 3), (5, 6), (5, 8);

-- Cabin 6: Wifi, Kitchen, Pet Friendly, Forest Views, AC, Fire pit
INSERT INTO `cabin_amenities` (`cabin_id`, `amenity_id`) VALUES
(6, 1), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8);

-- Bookings Table
CREATE TABLE `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `cabin_id` INT NOT NULL,
  `check_in` DATE NOT NULL,
  `check_out` DATE NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `guests_count` INT NOT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `bookings` (`id`, `user_id`, `cabin_id`, `check_in`, `check_out`, `total_price`, `guests_count`, `status`) VALUES
(1, 2, 1, '2026-09-10', '2026-09-12', 360.00, 2, 'confirmed'),
(2, 2, 4, '2026-10-05', '2026-10-08', 390.00, 2, 'pending'),
(3, 3, 2, '2026-08-20', '2026-08-23', 660.00, 3, 'confirmed');

-- Reviews Table
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `cabin_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`cabin_id`) REFERENCES `cabins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `reviews` (`id`, `user_id`, `cabin_id`, `rating`, `comment`) VALUES
(1, 2, 1, 5, 'Absolutely magical! The A-frame was spotless, the cedar hot tub was warm under the stars, and we felt completely disconnected from the noise of the city.'),
(2, 3, 1, 4, 'Very cozy and beautiful. The kitchen had everything we needed. Docking one star just because the Wi-Fi was a bit spotty during a brief storm, but otherwise wonderful.'),
(3, 2, 2, 5, 'Slept looking at the stars! The dome is such a unique experience. We loved the pellet stove and the modern bathroom. Highly recommend.'),
(4, 3, 3, 5, 'Spacious, clean, and incredible views of the Blue Ridge mountains. The deck is massive. We had a great family reunion here.'),
(5, 2, 5, 5, 'The treehouse is an engineering marvel. It is luxurious, quiet, and feels like another world. Worth every penny.');
