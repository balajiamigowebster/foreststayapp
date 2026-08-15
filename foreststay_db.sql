-- Forest Stay Campsite Database Dump
-- Generated on: 2026-08-15T13:12:47.455Z

SET FOREIGN_KEY_CHECKS=0;

-- ------------------------------------------------------
-- Table structure for table `amenities`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `amenities`;
CREATE TABLE `amenities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `amenities`
LOCK TABLES `amenities` WRITE;
INSERT INTO `amenities` VALUES 
(1, 'High-Speed Wi-Fi', 'Wifi'),
(2, 'Private Cedar Hot Tub', 'Droplet'),
(3, 'Wood-burning Fireplace', 'Flame'),
(4, 'Fully Equipped Kitchen', 'Utensils'),
(5, 'Pet Friendly', 'Heart'),
(6, 'Panoramic Forest Views', 'Compass'),
(7, 'Air Conditioning', 'Wind'),
(8, 'Outdoor Fire Pit', 'Zap');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `bookings`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `cabin_id` int(11) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `guests_count` int(11) NOT NULL,
  `status` enum('pending','confirmed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `cabin_id` (`cabin_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`cabin_id`) REFERENCES `cabins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `bookings`
LOCK TABLES `bookings` WRITE;
INSERT INTO `bookings` VALUES 
(1, 2, 1, '2026-09-09 18:30:00', '2026-09-11 18:30:00', '360.00', 2, 'confirmed', '2026-08-10 03:39:29'),
(2, 2, 4, '2026-10-04 18:30:00', '2026-10-07 18:30:00', '390.00', 2, 'pending', '2026-08-10 03:39:29'),
(3, 3, 2, '2026-08-19 18:30:00', '2026-08-22 18:30:00', '660.00', 3, 'confirmed', '2026-08-10 03:39:29'),
(4, 1, 1, '2026-08-11 18:30:00', '2026-08-13 18:30:00', '360.00', 1, 'confirmed', '2026-08-12 11:45:45');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `cabin_amenities`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `cabin_amenities`;
CREATE TABLE `cabin_amenities` (
  `cabin_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL,
  PRIMARY KEY (`cabin_id`,`amenity_id`),
  KEY `amenity_id` (`amenity_id`),
  CONSTRAINT `cabin_amenities_ibfk_1` FOREIGN KEY (`cabin_id`) REFERENCES `cabins` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cabin_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `cabin_amenities`
LOCK TABLES `cabin_amenities` WRITE;
INSERT INTO `cabin_amenities` VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 6),
(1, 8),
(2, 1),
(2, 2),
(2, 4),
(2, 6),
(2, 7),
(2, 8),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8),
(4, 3),
(4, 4),
(4, 5),
(4, 6),
(4, 8),
(5, 1),
(5, 2),
(5, 3),
(5, 6),
(5, 8),
(6, 1),
(6, 4),
(6, 5),
(6, 6),
(6, 7),
(6, 8);
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `cabins`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `cabins`;
CREATE TABLE `cabins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `max_guests` int(11) NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `cabins`
LOCK TABLES `cabins` WRITE;
INSERT INTO `cabins` VALUES 
(1, 'Silverwood A-Frame', 'A breathtaking mid-century A-frame nestled deep within a redwood forest. Features a modern minimalist interior, glass walls, a cedar hot tub, and a suspended fire pit. Perfect for couples looking for an intimate nature retreat.', '180.00', 2, 'Redwood National Park, CA', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200', '4.80', '2026-08-10 03:39:29'),
(2, 'Fernwood Geodesic Dome', 'Immerse yourself in nature in this luxurious geodesic dome. Enjoy star-gazing through the panoramic transparent ceiling while staying cozy by the pellet stove. Fully equipped kitchen and outdoor deck with forest views.', '220.00', 4, 'Olympic Peninsula, WA', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200', '4.90', '2026-08-10 03:39:29'),
(3, 'Pinecrest Luxury Lodge', 'A massive log home perfect for family gatherings or group retreats. Boasts 4 spacious bedrooms, a floor-to-ceiling stone fireplace, a fully equipped chef\'s kitchen, game room, and a massive wraparound deck overlooking the valley.', '390.00', 8, 'Blue Ridge Mountains, NC', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=1200', '4.70', '2026-08-10 03:39:29'),
(4, 'Whispering Pines Cabin', 'A charming rustic cabin designed for comfort. Surrounded by towering ponderosa pines, it offers a peaceful covered porch, an open-concept loft, and immediate access to hiking trails and a nearby mountain stream.', '130.00', 3, 'Bend, OR', 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1200', '4.60', '2026-08-10 03:39:29'),
(5, 'Mossy Creek Treehouse', 'Live out your childhood dream in this architecturally designed luxury treehouse. Suspended 15 feet off the forest floor, it features a suspension bridge entrance, wood-burning hot tub, and elegant modern interiors.', '290.00', 2, 'Smoky Mountains, TN', 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=1200', '4.95', '2026-08-10 03:39:29'),
(6, 'Golden Hour Hideaway', 'A modern, sun-drenched container home built on a ridge. Expansive floor-to-ceiling windows catch the golden rays filtering through the birch canopy. Features a private fire pit area and premium design elements.', '160.00', 2, 'Catskills, NY', 'https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&q=80&w=1200', '4.75', '2026-08-10 03:39:29');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `cafe_orders`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `cafe_orders`;
CREATE TABLE `cafe_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `items_json` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `cafe_orders`
LOCK TABLES `cafe_orders` WRITE;
INSERT INTO `cafe_orders` VALUES 
(1, '[{"name":"Filter Coffee","qty":2,"price":120},{"name":"Woodfired Pizza","qty":1,"price":450}]', '690.00', '2026-08-10 03:45:30'),
(2, '[{"name":"Forest Berry Tea","qty":1,"price":150},{"name":"Spiced Garlic Bread","qty":1,"price":222}]', '372.00', '2026-08-10 03:45:30'),
(3, '[{"id":2,"name":"Scrambled Eggs with Toast","price":150,"category":"breakfast","stock":20,"qty":1},{"id":3,"name":"Campsite Masala Omelette","price":120,"category":"breakfast","stock":30,"qty":1},{"id":6,"name":"Forest Salad","price":280,"category":"lunch","stock":18,"qty":1}]', '550.00', '2026-08-10 04:16:47'),
(4, '[{"id":3,"name":"Campsite Masala Omelette","price":120,"category":"breakfast","stock":30,"qty":1},{"id":2,"name":"Scrambled Eggs with Toast","price":150,"category":"breakfast","stock":20,"qty":1}]', '270.00', '2026-08-10 04:17:54'),
(5, '[{"id":2,"name":"Scrambled Eggs with Toast","price":150,"category":"breakfast","stock":20,"qty":1},{"id":3,"name":"Campsite Masala Omelette","price":120,"category":"breakfast","stock":30,"qty":1}]', '270.00', '2026-08-10 06:56:59'),
(6, '[{"id":1,"name":"Fluffy Pancakes with Maple Syrup","price":180,"category":"breakfast","stock":25,"qty":1},{"id":2,"name":"Scrambled Eggs with Toast","price":150,"category":"breakfast","stock":20,"qty":1}]', '330.00', '2026-08-15 09:26:48'),
(7, '[{"id":2,"name":"Scrambled Eggs with Toast","price":150,"category":"breakfast","stock":20,"qty":1},{"id":1,"name":"Fluffy Pancakes with Maple Syrup","price":180,"category":"breakfast","stock":25,"qty":1}]', '330.00', '2026-08-15 09:27:02');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `inventory`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_required` decimal(10,2) NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Food',
  `max_capacity` decimal(10,2) DEFAULT 50.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `inventory`
LOCK TABLES `inventory` WRITE;
INSERT INTO `inventory` VALUES 
(5, 'Premium Coffee Beans', 'i-01', '12.00', 'kg', '5.00', 'Beverages', '25.00'),
(6, 'Organic Tea Leaves', 'i-02', '8.00', 'kg', '3.00', 'Beverages', '15.00'),
(7, 'Campsite Basmati Rice', 'i-03', '25.00', 'kg', '10.00', 'Food', '50.00'),
(8, 'Hardwood BBQ Coal', 'i-04', '4.00', 'kg', '5.00', 'BBQ Stock', '40.00'),
(9, 'LPG Camping Gas Cylinder', 'i-05', '15.00', 'units', '5.00', 'Utilities', '20.00'),
(10, 'Campsite Sleeping Bags', 'i-06', '18.00', 'units', '10.00', 'Camping Equipment', '30.00'),
(11, 'Dome Tents (4-Person)', 'i-07', '3.00', 'units', '5.00', 'Camping Equipment', '15.00');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `reviews`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `cabin_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `cabin_id` (`cabin_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`cabin_id`) REFERENCES `cabins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `reviews`
LOCK TABLES `reviews` WRITE;
INSERT INTO `reviews` VALUES 
(1, 2, 1, 5, 'Absolutely magical! The A-frame was spotless, the cedar hot tub was warm under the stars, and we felt completely disconnected from the noise of the city.', '2026-08-10 03:39:29'),
(2, 3, 1, 4, 'Very cozy and beautiful. The kitchen had everything we needed. Docking one star just because the Wi-Fi was a bit spotty during a brief storm, but otherwise wonderful.', '2026-08-10 03:39:29'),
(3, 2, 2, 5, 'Slept looking at the stars! The dome is such a unique experience. We loved the pellet stove and the modern bathroom. Highly recommend.', '2026-08-10 03:39:29'),
(4, 3, 3, 5, 'Spacious, clean, and incredible views of the Blue Ridge mountains. The deck is massive. We had a great family reunion here.', '2026-08-10 03:39:29'),
(5, 2, 5, 5, 'The treehouse is an engineering marvel. It is luxurious, quiet, and feels like another world. Worth every penny.', '2026-08-10 03:39:29');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `staff`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Permanent',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `rating` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Good',
  `assigned_tasks` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `today_attendance` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Present',
  `monthly_base` decimal(10,2) DEFAULT 0.00,
  `daily_rate` decimal(10,2) DEFAULT 0.00,
  `days_worked` int(11) DEFAULT 0,
  `half_days` int(11) DEFAULT 0,
  `bonus` decimal(10,2) DEFAULT 0.00,
  `deductions` decimal(10,2) DEFAULT 0.00,
  `shift` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Morning Shift',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `staff`
LOCK TABLES `staff` WRITE;
INSERT INTO `staff` VALUES 
(6, 'Flavius Ignatius', 'Senior Guide', 'Active', 'Permanent', '9876543210', 'flavius@foreststay.in', 'Excellent', 'Guide Sunrise Trek / Lead nature walks / Customer support', 'Present', '25000.00', '0.00', 20, 0, '0.00', '0.00', 'Morning Shift'),
(7, 'Arjun Mehta', 'Manager', 'Active', 'Permanent', '9876543211', 'arjun@foreststay.in', 'Excellent', 'Coordinate stays / Resource planning / Customer relation', 'Present', '35000.00', '0.00', 24, 1, '1500.00', '500.00', 'Morning Shift'),
(8, 'Vikram Singh', 'Entry Gate Staff', 'Active', 'Permanent', '9840050607', 'vikram@foreststay.in', 'Good', 'Scan visitor entry QR codes / Log vehicle numbers / Collect cash entry fees', 'Present', '16000.00', '0.00', 25, 0, '0.00', '0.00', 'Morning Shift'),
(9, 'Suresh Kumar', 'Guide / Event Helper', 'Active', 'Temporary/Daily Wage', '9855566778', 'suresh@tempworker.in', 'Good', 'Assist weekend trekkers / Campfire setup', 'Present', '0.00', '500.00', 18, 1, '0.00', '0.00', 'Morning Shift'),
(10, 'Chef Mary', 'Kitchen Head', 'Active', 'Permanent', '9811122233', 'mary@foreststay.in', 'Good', 'Oversee cafe menu / Prep campsite buffet / Control raw inventory stock', 'Present', '22000.00', '0.00', 22, 0, '0.00', '0.00', 'Morning Shift');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `trek_bookings`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `trek_bookings`;
CREATE TABLE `trek_bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `trek_id` int(11) NOT NULL,
  `participants` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `trek_id` (`trek_id`),
  CONSTRAINT `trek_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trek_bookings_ibfk_2` FOREIGN KEY (`trek_id`) REFERENCES `treks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `trek_bookings`
-- No data found in `trek_bookings`

-- ------------------------------------------------------
-- Table structure for table `treks`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `treks`;
CREATE TABLE `treks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `guide_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Forest Trail',
  `difficulty` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Easy',
  `max_group` int(11) DEFAULT 15,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guide_included` tinyint(1) DEFAULT 1,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `treks`
LOCK TABLES `treks` WRITE;
INSERT INTO `treks` VALUES 
(4, 'Sunrise Peak Trail Trek', '2.5 Hours', '400.00', 'Arun Kumar', 'Sunrise Trek', 'Moderate', 15, 'Guided early morning climb to catch sunrise over mist-covered mountains.', 1, 'Active'),
(5, 'Sunset Nature Trail Trek', '2 Hours', '300.00', 'Vijay Singh', 'Sunset Trek', 'Easy', 20, 'Relaxing evening trail walk through lush pine forests ending at sunset ridge.', 1, 'Active'),
(6, 'Guided Deep Forest Walk Trek', '1.5 Hours', '200.00', 'Arun Kumar', 'Forest Trail', 'Easy', 25, 'Educational flora and fauna tour guided by experienced local forest rangers.', 1, 'Active'),
(7, 'Midnight Stargazing Night Trek', '3 Hours', '500.00', 'Vijay Singh', 'Night Trek', 'Moderate', 12, 'Night expedition with headlamps and celestial observation at high plateau.', 1, 'Active');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `users`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES 
(1, 'Admin User', 'admin@foreststay.com', '$2a$10$XYTOSLtKlKzGNHHnJWo7Z.032XOSmsRFC6a7TTZWAMQLXYFfUsNmi', 'admin', '2026-08-10 03:39:29'),
(2, 'John Doe', 'guest@foreststay.com', '$2a$10$XYTOSLtKlKzGNHHnJWo7Z.032XOSmsRFC6a7TTZWAMQLXYFfUsNmi', 'user', '2026-08-10 03:39:29'),
(3, 'Sarah Connor', 'sarah@foreststay.com', '$2a$10$XYTOSLtKlKzGNHHnJWo7Z.032XOSmsRFC6a7TTZWAMQLXYFfUsNmi', 'user', '2026-08-10 03:39:29');
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `visitor_passes`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `visitor_passes`;
CREATE TABLE `visitor_passes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visitor_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass_type` enum('adult','child','foreigner') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `visitor_passes`
LOCK TABLES `visitor_passes` WRITE;
INSERT INTO `visitor_passes` VALUES 
(1, 'Group of Friends', 'adult', 9, '1350.00', '2026-08-10 03:45:30'),
(2, 'Tourists Group', 'foreigner', 3, '1500.00', '2026-08-10 03:45:30'),
(3, 'Family Outing', 'child', 7, '525.00', '2026-08-10 03:45:30');
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS=1;
