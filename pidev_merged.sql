-- ============================================================
-- Base de données unifiée : pidev_amine
-- Fusion de pidev-user + ui_bad (smart_rental_platform)
-- Généré le : 02 mars 2026
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pidev_amine`
--

CREATE DATABASE IF NOT EXISTS `pidev_amine` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pidev_amine`;

-- ========================================
-- Table `user` (pidev-user schema complet + données ui_bad)
-- ========================================

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(180) NOT NULL,
  `roles` longtext NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `account_status` varchar(20) NOT NULL DEFAULT 'active',
  `failed_login_attempts` smallint(6) NOT NULL DEFAULT 0,
  `suspicious_activity_score` smallint(6) NOT NULL DEFAULT 0,
  `last_login_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `last_failed_login_at` datetime DEFAULT NULL,
  `suspended_until` datetime DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `deactivated_at` datetime DEFAULT NULL,
  `reactivation_requested_at` datetime DEFAULT NULL,
  `reactivation_request_note` longtext DEFAULT NULL,
  `selfie_image` varchar(255) DEFAULT NULL,
  `identity_document_image` varchar(255) DEFAULT NULL,
  `face_verified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `is_verified`, `nom`, `prenom`, `account_status`, `failed_login_attempts`, `suspicious_activity_score`, `last_login_at`, `last_login_ip`, `last_failed_login_at`, `suspended_until`, `first_name`, `last_name`, `phone`, `avatar`, `deactivated_at`, `reactivation_requested_at`, `reactivation_request_note`, `selfie_image`, `identity_document_image`, `face_verified_at`) VALUES
(1, 'test@example.com', '[\"ROLE_ADMIN\"]', '123456', 1, NULL, NULL, 'active', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'user@test.com', '[\"ROLE_USER\"]', '$2y$13$jWiPz0SowK0g1YBob4.TQeJndh67t/uHh2U85mEmAn6G.Sxz4.VGi', 1, 'Dupont', 'Jean', 'active', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'host@test.com', '[\"ROLE_HOST\"]', '$2y$13$4SphgAy0/d7BZwhPmn5e3OtO/z/KLKCGeJYOD4gx00C4nhme9iZ8C', 1, 'Martin', 'Marie', 'active', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'admin@test.com', '[\"ROLE_ADMIN\"]', '$2y$13$3QaoBIGuwzyvikODnG7ydu7PpEyCA1vEIlE22VOiVaRS5Geq.dwTq', 1, 'System', 'Admin', 'active', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'faresmanar28055@gmail.com', '[\"ROLE_ADMIN\"]', '$2y$13$M9BA8IirzfnPNdLMQ.dpJ.8X64mrXpK/Lt05pzmaq1iu334Lu2s0m', 1, NULL, NULL, 'active', 0, 0, '2026-02-28 21:50:00', '127.0.0.1', '2026-02-23 09:38:27', NULL, 'Admin', 'RentAdmin', '+33 6 12 34 56 78', '/uploads/avatars/ChatGPT-Image-31-janv-2026-13-14-08-699b27772c1e13.20410235.png', NULL, NULL, NULL, '/uploads/verification/selfies/7e755592-7394-4f73-8916-308de2160f83-699c21b42c5a15.95404495.jpg', '/uploads/verification/identity/6782e89d-fb61-44df-9ce4-0303b2dd3fcc-699c21b42d31b0.30607887.jpg', '2026-02-23 09:45:29'),
(6, 'moenes234@gmail.com', '[\"ROLE_USER\"]', '$2y$13$wJ3uwzOJ9UaFGxsWdlj1X.7nbSqg8VpUbSuaQxKOzuHsRax80d1wW', 1, NULL, NULL, 'active', 0, 0, '2026-02-23 09:12:17', '127.0.0.1', '2026-02-22 16:01:35', NULL, 'moenes', 'kharoubi', '56668703', NULL, NULL, NULL, NULL, '/uploads/verification/selfies/82f4c382-4ba7-4091-a244-5336e0624653-699b7216121771.07977075.jpg', '/uploads/verification/identity/ca1ec439-2551-48a2-a4a1-b48e270fc5d1-699b7216127008.59369723.jpg', '2026-02-22 21:16:18'),
(7, 'yesmin.ARFA@esprit.tn', '[\"ROLE_USER\"]', '$2y$13$5Dtjup/TGF.7Vhsm7Ivn3eJ0KT74xPOzGJJqQ9BSO.qYDb2edbmzi', 1, NULL, NULL, 'banned', 2, 26, '2026-02-23 09:53:46', '127.0.0.1', '2026-02-23 10:17:22', NULL, '', '', '', NULL, NULL, NULL, NULL, '/uploads/verification/selfies/WhatsApp-Image-2026-02-23-at-4-11-45-AM-699c24710716c9.39306286.jpeg', '/uploads/verification/identity/WhatsApp-Image-2026-02-23-at-4-11-45-AM-1-699c2471079cc6.36100936.jpeg', '2026-02-23 09:57:09'),
(8, 'MOENES.KHAROU@esprit.tn', '[\"ROLE_USER\"]', '$2y$13$KwWJ47Jq2vm6JGPUFe1plu3PV63jALgRpQ28R48ritRP8BxHvUkza', 1, NULL, NULL, 'active', 0, 0, '2026-02-23 10:02:08', '127.0.0.1', NULL, NULL, 'manar', 'fares', '', NULL, NULL, NULL, NULL, '/uploads/verification/selfies/WhatsApp-Image-2026-02-23-at-4-11-45-AM-699c26eaad2212.23323434.jpeg', '/uploads/verification/identity/WhatsApp-Image-2026-02-23-at-4-11-45-AM-1-699c26eaad6ce5.94082104.jpeg', '2026-02-23 10:07:43'),
(9, 'guest@test.com', '[\"ROLE_USER\"]', '$2y$13$DX2B1iW8OKiT0MZU2DHvNefdWwm97yhZBPomKI01f/uQRxHzbtovS', 1, NULL, NULL, 'active', 0, 0, NULL, NULL, NULL, NULL, 'Guest', 'User', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- ========================================
-- Table `categorie` (stub pidev-user)
-- ========================================

DROP TABLE IF EXISTS `categorie`;
CREATE TABLE `categorie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table `category` (ui_bad — services/tools/logements)
-- ========================================

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `category` (`id`, `name`, `description`, `type`, `icon`, `created_at`) VALUES
(113, 'Plumbing', 'Plumbing and pipe services', 'service', 'fa-solid fa-pipe', '2026-03-01 22:31:21'),
(114, 'Electrical', 'Electrical repairs and installations', 'service', 'fa-solid fa-bolt', '2026-03-01 22:31:21'),
(115, 'Gardening', 'Garden maintenance and landscaping', 'service', 'fa-solid fa-seedling', '2026-03-01 22:31:21'),
(116, 'Cleaning', 'House and office cleaning services', 'service', 'fa-solid fa-broom', '2026-03-01 22:31:21'),
(117, 'Painting', 'Interior and exterior painting', 'service', 'fa-solid fa-paint-roller', '2026-03-01 22:31:21'),
(118, 'Moving', 'Moving and transport services', 'service', 'fa-solid fa-truck-moving', '2026-03-01 22:31:21'),
(119, 'Tutoring', 'Educational tutoring services', 'service', 'fa-solid fa-book-open', '2026-03-01 22:31:21'),
(120, 'IT Support', 'Computer and tech support', 'service', 'fa-solid fa-laptop', '2026-03-01 22:31:21'),
(121, 'Power Tools', 'Electric and battery-powered tools', 'tool', 'fa-solid fa-screwdriver-wrench', '2026-03-01 22:31:21'),
(122, 'Hand Tools', 'Manual tools and equipment', 'tool', 'fa-solid fa-hammer', '2026-03-01 22:31:21'),
(123, 'Garden Tools', 'Lawn and garden equipment', 'tool', 'fa-solid fa-trowel', '2026-03-01 22:31:21'),
(124, 'Ladders', 'Ladders and scaffolding', 'tool', 'fa-solid fa-ladder', '2026-03-01 22:31:21'),
(125, 'Cleaning Equipment', 'Vacuum cleaners and pressure washers', 'tool', 'fa-solid fa-spray-can', '2026-03-01 22:31:21'),
(126, 'Measuring Tools', 'Levels, tape measures, and laser tools', 'tool', 'fa-solid fa-ruler', '2026-03-01 22:31:21'),
(127, 'Outdoor Equipment', 'Camping and outdoor gear', 'tool', 'fa-solid fa-campground', '2026-03-01 22:31:21'),
(128, 'Party Equipment', 'Tables, chairs, and party supplies', 'tool', 'fa-solid fa-cake-candles', '2026-03-01 22:31:21'),
(129, 'Entire House', 'Complete house for rent', 'logement', 'fa-solid fa-house', '2026-03-01 22:31:21'),
(130, 'Apartment', 'Apartment or flat', 'logement', 'fa-solid fa-building', '2026-03-01 22:31:21'),
(131, 'Private Room', 'Private room in shared space', 'logement', 'fa-solid fa-bed', '2026-03-01 22:31:21'),
(132, 'Shared Room', 'Shared room accommodation', 'logement', 'fa-solid fa-people-roof', '2026-03-01 22:31:21'),
(133, 'Villa', 'Luxury villa', 'logement', 'fa-solid fa-house-chimney', '2026-03-01 22:31:21'),
(134, 'Cabin', 'Cabin or cottage', 'logement', 'fa-solid fa-house-flag', '2026-03-01 22:31:21'),
(135, 'Beach House', 'Beach front property', 'logement', 'fa-solid fa-umbrella-beach', '2026-03-01 22:31:21'),
(136, 'Mountain Chalet', 'Mountain chalet or lodge', 'logement', 'fa-solid fa-mountain', '2026-03-01 22:31:21');

-- ========================================
-- Table `avis`
-- ========================================

DROP TABLE IF EXISTS `avis`;
CREATE TABLE `avis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `note` int(11) NOT NULL,
  `commentaire` longtext NOT NULL,
  `date_creation` datetime NOT NULL,
  `reponse_hote` longtext DEFAULT NULL,
  `date_reponse` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8F91ABF0B83297E7` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `avis` (`id`, `reservation_id`, `note`, `commentaire`, `date_creation`, `reponse_hote`, `date_reponse`) VALUES
(1, 3, 4, 'try try try', '2026-02-22 01:43:14', NULL, NULL);

-- ========================================
-- Table `covoiturage`
-- ========================================

DROP TABLE IF EXISTS `covoiturage`;
CREATE TABLE `covoiturage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conducteur_id` int(11) NOT NULL,
  `depart` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `date_depart` datetime NOT NULL,
  `places` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_28C79E89F16F4AC6` (`conducteur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `covoiturage` (`id`, `conducteur_id`, `depart`, `destination`, `date_depart`, `places`) VALUES
(1, 3, 'ggg', 'ggggggg', '2026-02-28 02:38:00', 5),
(2, 3, 'Behaya, Délégation Mateur, Gouvernorat Bizerte, Tunisie', 'Edkhila, Délégation Tebourba, Gouvernorat La Manouba, Tunisie', '2026-02-28 02:52:00', 5),
(3, 3, '51.5739, 1.2948', 'Neuer Weg, Geyer, Verwaltungsgemeinschaft Geyer, Erzgebirgskreis, Saxe, 09468, Allemagne', '2026-03-07 03:14:00', 4),
(4, 3, '48.5788, 2.2565', 'Les Besneries, Parcé-sur-Sarthe, La Flèche, Sarthe, Pays de la Loire, France métropolitaine, 72300, France', '2026-03-07 04:21:00', 2),
(5, 4, '36.8503, 10.1826', 'ggggggg', '2026-02-28 04:22:00', 11),
(6, 5, 'Le Kef, Zaafrane, Délégation Kef Est, Gouvernorat Le Kef, 7121, Tunisie', 'Avenue Taïeb Mhiri, Ben Gardane, Ben Gardane Nord, Délégation Ben Gardane, Gouvernorat Médenine, 4160, Tunisie', '2026-02-22 22:44:00', 3);

-- ========================================
-- Table `doctrine_migration_versions` (fusionnée)
-- ========================================

DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20260208195311', '2026-02-21 15:58:32', 1),
('DoctrineMigrations\\Version20260209092349', '2026-02-21 15:58:32', 153),
('DoctrineMigrations\\Version20260212210246', '2026-02-21 15:58:32', 120),
('DoctrineMigrations\\Version20260213133453', '2026-02-21 15:58:32', 29),
('DoctrineMigrations\\Version20260221144320', '2026-02-21 15:58:32', 33),
('DoctrineMigrations\\Version20260222005746', '2026-02-22 00:58:31', 268),
('DoctrineMigrations\\Version20260222143000', '2026-02-22 14:38:56', 114),
('DoctrineMigrations\\Version20260222173000', '2026-02-22 20:35:22', 102),
('DoctrineMigrations\\Version20260223050529', '2026-02-23 05:05:40', 82),
('DoctrineMigrations\\Version20260301012526', '2026-03-01 01:25:58', 431);

-- ========================================
-- Table `favorite`
-- ========================================

DROP TABLE IF EXISTS `favorite`;
CREATE TABLE `favorite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `item_type` varchar(50) NOT NULL,
  `item_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_item` (`user_id`, `item_type`, `item_id`),
  KEY `IDX_68C58ED9A76ED395` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table `foyer` (stub pidev-user)
-- ========================================

DROP TABLE IF EXISTS `foyer`;
CREATE TABLE `foyer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table `home`
-- ========================================

DROP TABLE IF EXISTS `home`;
CREATE TABLE `home` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `host_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `max_guests` int(11) NOT NULL,
  `bedrooms` int(11) NOT NULL,
  `bathrooms` int(11) NOT NULL,
  `beds` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `amenities` longtext NOT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `additional_images` longtext DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `IDX_71D60CD01FB8D185` (`host_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table `logement` (schéma fusionné pidev-user + ui_bad)
-- Colonnes françaises (pidev-user) + colonnes anglaises (ui_bad)
-- ========================================

DROP TABLE IF EXISTS `logement`;
CREATE TABLE `logement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `proprietaire_id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `adresse` varchar(255) NOT NULL,
  `prix_par_nuit` decimal(10,2) NOT NULL,
  `nombre_chambres` int(11) NOT NULL DEFAULT 1,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `image` varchar(255) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `capacite` int(11) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `number_of_rooms` int(11) DEFAULT NULL,
  `number_of_beds` int(11) DEFAULT NULL,
  `number_of_bathrooms` int(11) DEFAULT NULL,
  `max_guests` int(11) DEFAULT NULL,
  `square_meters` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `image_name` varchar(255) DEFAULT NULL,
  `image_size` int(11) DEFAULT NULL,
  `image_updated_at` datetime DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_F0FD445776C50E4A` (`proprietaire_id`),
  KEY `IDX_F0FD445712469DE2` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données pidev-user (IDs 1-17, colonnes françaises remplies)
INSERT INTO `logement` (`id`, `proprietaire_id`, `titre`, `description`, `adresse`, `prix_par_nuit`, `nombre_chambres`, `disponible`, `image`, `type`, `capacite`, `city`, `country`, `number_of_rooms`, `number_of_beds`, `number_of_bathrooms`, `max_guests`, `square_meters`, `is_active`, `image_name`, `image_size`, `image_updated_at`, `category_id`) VALUES
(1, 3, 'Appartement Parisien Charmant', 'Magnifique appartement au cœur de Paris avec vue imprenable sur la Tour Eiffel. Idéal pour un séjour romantique ou des vacances en famille.', '15 Rue de la Paix, 75002 Paris', 150.00, 2, 1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', 'Appartement', 4, NULL, NULL, 2, NULL, NULL, 4, NULL, 1, NULL, NULL, NULL, NULL),
(2, 3, 'Villa Moderne avec Piscine', 'Superbe villa contemporaine avec piscine privée, jardin paysager et vue panoramique. Parfait pour des vacances de luxe en famille.', '42 Avenue des Mimosas, 06400 Cannes', 350.00, 4, 1, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', 'Villa', 8, NULL, NULL, 4, NULL, NULL, 8, NULL, 1, NULL, NULL, NULL, NULL),
(3, 3, 'Studio Cosy Centre-Ville', 'Studio moderne et fonctionnel en plein centre-ville. Proche de toutes commodités, transports et attractions touristiques.', '8 Rue du Commerce, 69002 Lyon', 75.00, 1, 1, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop', 'Studio', 2, NULL, NULL, 1, NULL, NULL, 2, NULL, 1, NULL, NULL, NULL, NULL),
(4, 3, 'Maison de Campagne Authentique', 'Charmante maison de campagne rénovée avec goût. Grand jardin, cheminée et calme absolu. Idéal pour se ressourcer.', '23 Chemin des Vignes, 84220 Gordes', 180.00, 3, 1, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop', 'Maison', 6, NULL, NULL, 3, NULL, NULL, 6, NULL, 1, NULL, NULL, NULL, NULL),
(5, 3, 'Loft Industriel Moderne', 'Loft spacieux au style industriel dans un ancien entrepôt rénové. Hauteur sous plafond exceptionnelle et grande luminosité.', '56 Rue des Artistes, 13001 Marseille', 120.00, 2, 1, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop', 'Loft', 4, NULL, NULL, 2, NULL, NULL, 4, NULL, 1, NULL, NULL, NULL, NULL),
(6, 3, 'Appartement Parisien Charmant', 'Magnifique appartement au cœur de Paris avec vue imprenable sur la Tour Eiffel. Idéal pour un séjour romantique ou des vacances en famille.', '15 Rue de la Paix, 75002 Paris', 150.00, 2, 1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', 'Appartement', 4, NULL, NULL, 2, NULL, NULL, 4, NULL, 1, NULL, NULL, NULL, NULL),
(7, 3, 'Villa Moderne avec Piscine', 'Superbe villa contemporaine avec piscine privée, jardin paysager et vue panoramique. Parfait pour des vacances de luxe en famille.', '42 Avenue des Mimosas, 06400 Cannes', 350.00, 4, 1, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', 'Villa', 8, NULL, NULL, 4, NULL, NULL, 8, NULL, 1, NULL, NULL, NULL, NULL),
(8, 3, 'Studio Cosy Centre-Ville', 'Studio moderne et fonctionnel en plein centre-ville. Proche de toutes commodités, transports et attractions touristiques.', '8 Rue du Commerce, 69002 Lyon', 75.00, 1, 1, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop', 'Studio', 2, NULL, NULL, 1, NULL, NULL, 2, NULL, 1, NULL, NULL, NULL, NULL),
(9, 3, 'Maison de Campagne Authentique', 'Charmante maison de campagne rénovée avec goût. Grand jardin, cheminée et calme absolu. Idéal pour se ressourcer.', '23 Chemin des Vignes, 84220 Gordes', 180.00, 3, 1, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop', 'Maison', 6, NULL, NULL, 3, NULL, NULL, 6, NULL, 1, NULL, NULL, NULL, NULL),
(10, 3, 'Loft Industriel Moderne', 'Loft spacieux au style industriel dans un ancien entrepôt rénové. Hauteur sous plafond exceptionnelle et grande luminosité.', '56 Rue des Artistes, 13001 Marseille', 120.00, 2, 1, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop', 'Loft', 4, NULL, NULL, 2, NULL, NULL, 4, NULL, 1, NULL, NULL, NULL, NULL),
(11, 3, 'Appartement Parisien Charmant', 'Magnifique appartement au cœur de Paris avec vue imprenable sur la Tour Eiffel. Idéal pour un séjour romantique ou des vacances en famille.', '15 Rue de la Paix, 75002 Paris', 150.00, 2, 1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', 'Appartement', 4, NULL, NULL, 2, NULL, NULL, 4, NULL, 1, NULL, NULL, NULL, NULL),
(12, 3, 'Villa Moderne avec Piscine', 'Superbe villa contemporaine avec piscine privée, jardin paysager et vue panoramique. Parfait pour des vacances de luxe en famille.', '42 Avenue des Mimosas, 06400 Cannes', 350.00, 4, 1, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', 'Villa', 8, NULL, NULL, 4, NULL, NULL, 8, NULL, 1, NULL, NULL, NULL, NULL),
(13, 3, 'Studio Cosy Centre-Ville', 'Studio moderne et fonctionnel en plein centre-ville. Proche de toutes commodités, transports et attractions touristiques.', '8 Rue du Commerce, 69002 Lyon', 75.00, 1, 1, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop', 'Studio', 2, NULL, NULL, 1, NULL, NULL, 2, NULL, 1, NULL, NULL, NULL, NULL),
(14, 3, 'Maison de Campagne Authentique', 'Charmante maison de campagne rénovée avec goût. Grand jardin, cheminée et calme absolu. Idéal pour se ressourcer.', '23 Chemin des Vignes, 84220 Gordes', 180.00, 3, 1, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop', 'Maison', 6, NULL, NULL, 3, NULL, NULL, 6, NULL, 1, NULL, NULL, NULL, NULL),
(15, 3, 'Loft Industriel Moderne', 'Loft spacieux au style industriel dans un ancien entrepôt rénové. Hauteur sous plafond exceptionnelle et grande luminosité.', '56 Rue des Artistes, 13001 Marseille', 120.00, 2, 1, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop', 'Loft', 4, NULL, NULL, 2, NULL, NULL, 4, NULL, 1, NULL, NULL, NULL, NULL),
(16, 3, 'trygggggggg', 'trytrygggggggggggggggggggggggggggggggggggggggggggggggggg', 'trytrytryfsssssssssssssssssssssssssss', 2520.00, 2, 1, NULL, 'Studio', 15, NULL, NULL, 2, NULL, NULL, 15, NULL, 1, NULL, NULL, NULL, NULL),
(17, 3, 'trygggggggg', 'yhu\'j(èik-_olèçpmà_pçl-o_è(i-j\'uh(\"y\'ét', 'sdfrgtyrutiyop^', 152.00, 25, 1, NULL, 'Loft', 8787, NULL, NULL, 25, NULL, NULL, 8787, NULL, 1, NULL, NULL, NULL, NULL),
-- Données ui_bad (IDs 18-27, host_id remappé : 8→4, category_id conservé)
(18, 4, 'Cozy Studio in Downtown Tunis', 'Modern studio apartment in the heart of Tunis. Perfect for solo travelers or couples. Walking distance to restaurants, cafes, and public transport.', '15 Avenue Habib Bourguiba', 45.00, 1, 1, NULL, NULL, 2, 'Tunis', 'Tunisia', 1, 1, 1, 2, 35, 1, NULL, NULL, NULL, 130),
(19, 4, 'Luxury Villa with Sea View', 'Stunning 4-bedroom villa overlooking the Mediterranean Sea. Private pool, garden, and direct beach access. Perfect for families or groups.', '42 Route de la Marsa', 250.00, 4, 1, NULL, NULL, 8, 'La Marsa', 'Tunisia', 4, 6, 3, 8, 280, 1, NULL, NULL, NULL, NULL),
(20, 4, 'Charming Traditional House in Medina', 'Authentic Tunisian house in the historic Medina. Beautifully restored with traditional tiles and architecture. Rooftop terrace with city views.', '8 Rue du Pacha', 80.00, 3, 1, NULL, NULL, 6, 'Tunis', 'Tunisia', 3, 4, 2, 6, 150, 1, NULL, NULL, NULL, NULL),
(21, 4, 'Modern 2BR Apartment in Ariana', 'Spacious 2-bedroom apartment with modern amenities. Fully equipped kitchen, balcony, and parking. Close to shopping centers and schools.', '23 Avenue de la République', 60.00, 2, 1, NULL, NULL, 4, 'Ariana', 'Tunisia', 2, 3, 1, 4, 85, 1, NULL, NULL, NULL, 130),
(22, 4, 'Beachfront Apartment in Hammamet', 'Beautiful apartment right on the beach. Wake up to stunning sea views. Swimming pool, tennis court, and restaurant on-site.', '56 Avenue de la Plage', 95.00, 2, 1, NULL, NULL, 5, 'Hammamet', 'Tunisia', 2, 3, 2, 5, 95, 1, NULL, NULL, NULL, 130),
(23, 4, 'Countryside Villa in Nabeul', 'Peaceful villa surrounded by olive groves. Large garden, BBQ area, and outdoor dining. Perfect for a relaxing getaway.', 'Route de Menzel Temime Km 5', 120.00, 3, 1, NULL, NULL, 7, 'Nabeul', 'Tunisia', 3, 5, 2, 7, 200, 1, NULL, NULL, NULL, NULL),
(24, 4, 'Budget-Friendly Room in Carthage', 'Comfortable private room in a shared house. Great for budget travelers. Close to ancient Carthage ruins and museums.', '12 Rue Hannibal', 25.00, 1, 1, NULL, NULL, 1, 'Carthage', 'Tunisia', 1, 1, 1, 1, 18, 1, NULL, NULL, NULL, NULL),
(25, 4, 'Penthouse with Panoramic Views', 'Luxurious penthouse on the top floor. 360-degree views of the city and sea. Modern design, high-end appliances, and private terrace.', '88 Avenue Mohamed V', 180.00, 3, 1, NULL, NULL, 6, 'Tunis', 'Tunisia', 3, 4, 2, 6, 160, 1, NULL, NULL, NULL, 130),
(26, 4, 'Family House in Ben Arous', 'Spacious family home with garden and playground. Safe neighborhood, close to schools and parks. Perfect for long-term stays.', '34 Rue de la Liberté', 70.00, 3, 1, NULL, NULL, 6, 'Ben Arous', 'Tunisia', 3, 5, 2, 6, 140, 1, NULL, NULL, NULL, NULL),
(27, 4, 'Artistic Loft in Sidi Bou Said', 'Unique loft in the famous blue and white village. High ceilings, artistic decor, and stunning views. Walk to cafes and art galleries.', '7 Rue Sidi Chabaane', 110.00, 2, 1, NULL, NULL, 4, 'Sidi Bou Said', 'Tunisia', 2, 2, 1, 4, 75, 1, NULL, NULL, NULL, 130);

-- ========================================
-- Table `materiel` (stub pidev-user)
-- ========================================

DROP TABLE IF EXISTS `materiel`;
CREATE TABLE `materiel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table `messenger_messages`
-- ========================================

DROP TABLE IF EXISTS `messenger_messages`;
CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750` (`queue_name`, `available_at`, `delivered_at`, `id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table `participant`
-- ========================================

DROP TABLE IF EXISTS `participant`;
CREATE TABLE `participant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `passager_id` int(11) NOT NULL,
  `covoiturage_id` int(11) NOT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `message` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D79F6B1171A51189` (`passager_id`),
  KEY `IDX_D79F6B1162671590` (`covoiturage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `participant` (`id`, `passager_id`, `covoiturage_id`, `statut`, `date_creation`, `message`) VALUES
(1, 2, 1, 'confirme', '2026-02-22 02:39:23', NULL);

-- ========================================
-- Table `reservation`
-- ========================================

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE `reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `logement_id` int(11) NOT NULL,
  `locataire_id` int(11) NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `montant_total` decimal(10,2) NOT NULL,
  `statut` varchar(50) NOT NULL,
  `date_creation` datetime NOT NULL,
  `nombre_personnes` int(11) DEFAULT NULL,
  `notes_speciales` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_42C8495558ABF955` (`logement_id`),
  KEY `IDX_42C84955D8A38199` (`locataire_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reservation` (`id`, `logement_id`, `locataire_id`, `date_debut`, `date_fin`, `montant_total`, `statut`, `date_creation`, `nombre_personnes`, `notes_speciales`) VALUES
(3, 1, 2, '2026-01-22 01:41:55', '2026-01-25 01:41:55', 450.00, 'confirmee', '2026-01-22 01:41:55', 2, NULL),
(4, 17, 2, '2026-02-28 00:00:00', '2026-03-05 00:00:00', 760.00, 'confirmee', '2026-02-22 02:13:57', 1, NULL),
(5, 2, 2, '2026-02-22 00:00:00', '2026-03-05 00:00:00', 3850.00, 'refusee', '2026-02-22 02:18:18', 4, NULL),
(6, 3, 2, '2026-02-22 00:00:00', '2026-02-24 00:00:00', 150.00, 'confirmee', '2026-02-22 02:19:34', 2, NULL),
(7, 1, 2, '2026-02-24 00:00:00', '2026-02-26 00:00:00', 300.00, 'confirmee', '2026-02-22 03:18:45', 2, NULL),
(8, 2, 2, '2026-03-25 00:00:00', '2026-04-04 00:00:00', 3500.00, 'en_attente', '2026-02-22 03:57:02', 1, NULL),
(9, 2, 2, '2026-05-07 00:00:00', '2026-06-02 00:00:00', 9100.00, 'en_attente', '2026-02-22 03:59:11', 1, NULL),
(10, 10, 2, '2026-03-06 00:00:00', '2026-03-08 00:00:00', 240.00, 'en_attente', '2026-02-22 04:03:47', 3, NULL),
(11, 16, 2, '2026-03-03 00:00:00', '2026-03-08 00:00:00', 12600.00, 'en_attente', '2026-02-22 04:11:35', 12, NULL),
(12, 5, 4, '2026-03-18 00:00:00', '2026-04-01 00:00:00', 1680.00, 'confirmee', '2026-02-22 04:15:40', 2, NULL);

-- ========================================
-- Table `reset_password_request`
-- ========================================

DROP TABLE IF EXISTS `reset_password_request`;
CREATE TABLE `reset_password_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `selector` varchar(20) NOT NULL,
  `hashed_token` varchar(100) NOT NULL,
  `requested_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `expires_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_7CE748AA76ED395` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reset_password_request` (`id`, `user_id`, `selector`, `hashed_token`, `requested_at`, `expires_at`) VALUES
(1, 1, 'oaKfPbRRkZZCixIVRvUj', 'Ru889DFYZ6gL2YgAP1Pey8/fTGC077kKWzeKdGohTLg=', '2026-02-22 14:47:24', '2026-02-22 15:47:24'),
(2, 6, 'Ql7NPZZThe1WTaiuXcIC', 'jorF7L8+nlE4o96sehUOHp+PR6E+WZcPafdyRkDpGJE=', '2026-02-22 15:44:44', '2026-02-22 16:44:43'),
(3, 6, 'sokcf8ZfFA1l4Kzl0kXu', '2Opd7TSK+e8/8x51A1I5dYcqxvsn3HoxWqHcpggmZvc=', '2026-02-22 15:50:14', '2026-02-22 16:50:14'),
(4, 6, 'btrP3gnNXvCBNewZdmww', 'Z0ISHNI0r4ieLeJ5zhU6KHCgT7StUQ56VFzVtXh8cs8=', '2026-02-22 15:51:26', '2026-02-22 16:51:26'),
(5, 6, 'tNZkWcfml3YlHFN3tihN', 'NdOze2UXnfZIdHvxXF2RAokRDgTTLhhbI9N0m2lLFOE=', '2026-02-22 15:54:42', '2026-02-22 16:54:42'),
(8, 7, 'VWwO2PZXWjShgOE3ULl9', '2y14byB/gYohBCYpAKBLbujQLIIZ0iv4X9VB2ZvB/mA=', '2026-02-23 03:22:46', '2026-02-23 04:22:45'),
(11, 5, 'BNvH8jWuK29X87UoxvFw', '2ALT8aBFeTAGBPBEUHOLEqGity455u7e7m5MPgziJgQ=', '2026-02-23 09:42:15', '2026-02-23 10:42:15');

-- ========================================
-- Table `service` (schéma complet ui_bad, host_id remappé : 8→4, 9→3)
-- ========================================

DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `host_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `image_size` int(11) DEFAULT NULL,
  `image_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_E19D9AD21FB8D185` (`host_id`),
  KEY `IDX_E19D9AD212469DE2` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `service` (`id`, `host_id`, `name`, `description`, `base_price`, `duration_minutes`, `location`, `is_active`, `created_at`, `updated_at`, `category_id`, `image_name`, `image_size`, `image_updated_at`) VALUES
(39, 3, 'Plumbing Repair', 'Professional plumbing services for your home', 50.00, 120, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 113, NULL, NULL, NULL),
(40, 3, 'Garden Maintenance', 'Keep your garden beautiful all year round', 35.00, 180, 'Ariana', 0, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 115, NULL, NULL, NULL),
(41, 4, 'Emergency Plumbing Repair', 'Professional plumber available 24/7 for urgent repairs. Specializes in leak fixes, pipe bursts, and drain unclogging.', 50.00, 60, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 113, NULL, NULL, NULL),
(42, 4, 'Bathroom Renovation', 'Complete bathroom plumbing installation and renovation. Includes sink, toilet, shower, and bathtub installation.', 120.00, 480, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 113, NULL, NULL, NULL),
(43, 4, 'Home Electrical Wiring', 'Licensed electrician for home wiring, circuit installation, and electrical panel upgrades. Safety certified.', 60.00, 60, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 114, NULL, NULL, NULL),
(44, 4, 'Solar Panel Installation', 'Professional solar panel installation and maintenance. Reduce your electricity bills with renewable energy.', 200.00, 480, 'Ben Arous', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 114, NULL, NULL, NULL),
(45, 4, 'Garden Design & Maintenance', 'Complete garden design, planting, lawn care, and seasonal maintenance. Transform your outdoor space.', 40.00, 60, 'La Marsa', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 115, NULL, NULL, NULL),
(46, 4, 'Tree Trimming & Removal', 'Professional tree care including trimming, pruning, and safe removal. Certified arborist.', 80.00, 240, 'Carthage', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 115, NULL, NULL, NULL),
(47, 4, 'Deep House Cleaning', 'Thorough deep cleaning service for homes. Includes kitchen, bathrooms, floors, and windows.', 35.00, 60, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 116, NULL, NULL, NULL),
(48, 4, 'Move-Out Cleaning', 'Specialized cleaning for moving out. Ensure you get your deposit back with our thorough service.', 150.00, 240, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 116, NULL, NULL, NULL),
(49, 4, 'Interior House Painting', 'Professional interior painting service. Walls, ceilings, trim. Quality finish guaranteed.', 45.00, 60, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 117, NULL, NULL, NULL),
(50, 4, 'Exterior House Painting', 'Exterior painting and weatherproofing. Protect your home and improve curb appeal.', 55.00, 60, 'Ben Arous', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 117, NULL, NULL, NULL),
(51, 4, 'Residential Moving Service', 'Full-service moving with professional movers. Packing, loading, transport, and unloading.', 250.00, 480, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 118, NULL, NULL, NULL),
(52, 4, 'Furniture Assembly & Delivery', 'Furniture assembly and delivery service. We handle IKEA and all flat-pack furniture.', 30.00, 60, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 118, NULL, NULL, NULL),
(53, 4, 'Math & Science Tutoring', 'Experienced tutor for high school and university math and science. Improve your grades.', 25.00, 60, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 119, NULL, NULL, NULL),
(54, 4, 'Language Lessons', 'Native speaker offering English, French, and Arabic lessons. All levels welcome.', 20.00, 60, 'La Marsa', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 119, NULL, NULL, NULL),
(55, 4, 'Computer Repair & Setup', 'Expert computer repair, virus removal, software installation, and network setup.', 40.00, 60, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 120, NULL, NULL, NULL),
(56, 4, 'Website Development', 'Professional website development for small businesses. Responsive design and SEO optimized.', 500.00, 2400, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 120, NULL, NULL, NULL);

-- ========================================
-- Table `tool` (schéma complet ui_bad, host_id remappé : 8→4, 9→3)
-- ========================================

DROP TABLE IF EXISTS `tool`;
CREATE TABLE `tool` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `host_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 1,
  `location` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `image_size` int(11) DEFAULT NULL,
  `image_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_20F33ED11FB8D185` (`host_id`),
  KEY `IDX_20F33ED112469DE2` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tool` (`id`, `host_id`, `name`, `description`, `price_per_day`, `stock_quantity`, `location`, `is_active`, `created_at`, `updated_at`, `category_id`, `image_name`, `image_size`, `image_updated_at`) VALUES
(61, 3, 'Electric Drill', 'Professional grade electric drill with multiple bits', 15.00, 3, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 121, NULL, NULL, NULL),
(62, 3, 'Lawn Mower', 'Gas-powered lawn mower for large gardens', 25.00, 1, 'Ariana', 0, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 123, NULL, NULL, NULL),
(63, 4, 'Heavy Duty Power Drill', 'Professional 18V cordless drill with 2 batteries. Perfect for drilling and driving screws.', 15.00, 2, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 121, NULL, NULL, NULL),
(64, 4, 'Circular Saw', '7-inch circular saw for cutting wood and boards. Includes safety guard and extra blade.', 20.00, 1, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 121, NULL, NULL, NULL),
(65, 4, 'Electric Sander', 'Orbital sander for smooth finishing. Great for furniture refinishing and woodworking.', 12.00, 2, 'Ben Arous', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 121, NULL, NULL, NULL),
(66, 4, 'Angle Grinder', 'Powerful angle grinder for cutting metal and grinding. Includes safety equipment.', 18.00, 1, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 121, NULL, NULL, NULL),
(67, 4, 'Hammer & Nail Set', 'Complete hammer set with various nails and screws. Essential for basic repairs.', 5.00, 3, 'La Marsa', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 122, NULL, NULL, NULL),
(68, 4, 'Screwdriver Set', 'Professional 20-piece screwdriver set. Phillips, flathead, and precision sizes included.', 3.00, 4, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 122, NULL, NULL, NULL),
(69, 4, 'Wrench Set', 'Complete wrench set including adjustable and socket wrenches. Metric and imperial.', 8.00, 2, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 122, NULL, NULL, NULL),
(70, 4, 'Pliers & Wire Cutters', 'Professional pliers set with wire cutters. Perfect for electrical and plumbing work.', 4.00, 3, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 122, NULL, NULL, NULL),
(71, 4, 'Lawn Mower', 'Gas-powered lawn mower with adjustable cutting height. Maintain a beautiful lawn.', 25.00, 1, 'Carthage', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 123, NULL, NULL, NULL),
(72, 4, 'Hedge Trimmer', 'Electric hedge trimmer for shaping bushes and hedges. Lightweight and easy to use.', 15.00, 2, 'La Marsa', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 123, NULL, NULL, NULL),
(73, 4, 'Garden Hose & Sprinkler', '50-meter garden hose with adjustable sprinkler. Perfect for watering large areas.', 8.00, 3, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 123, NULL, NULL, NULL),
(74, 4, 'Leaf Blower', 'Powerful electric leaf blower for quick yard cleanup. Lightweight and efficient.', 12.00, 2, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 123, NULL, NULL, NULL),
(75, 4, 'Extension Ladder', '6-meter aluminum extension ladder. Safe and stable for high-reach work.', 20.00, 1, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 124, NULL, NULL, NULL),
(76, 4, 'Step Ladder', '2-meter folding step ladder. Perfect for indoor tasks and light outdoor work.', 10.00, 3, 'Ben Arous', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 124, NULL, NULL, NULL),
(77, 4, 'Scaffolding Set', 'Portable scaffolding system for large projects. Safe working platform for extended tasks.', 35.00, 1, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 124, NULL, NULL, NULL),
(78, 4, 'Vacuum Cleaner', 'Powerful vacuum cleaner with HEPA filter. Great for deep cleaning carpets and floors.', 10.00, 2, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 125, NULL, NULL, NULL),
(79, 4, 'Carpet Cleaner', 'Professional carpet cleaning machine. Remove stains and refresh your carpets.', 18.00, 1, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 125, NULL, NULL, NULL),
(80, 4, 'Pressure Washer', 'High-pressure washer for outdoor cleaning. Clean driveways, walls, and vehicles.', 22.00, 1, 'La Marsa', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 125, NULL, NULL, NULL),
(81, 4, 'Floor Polisher', 'Electric floor polisher for marble and tile floors. Restore shine to your floors.', 15.00, 1, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 125, NULL, NULL, NULL),
(82, 4, 'Laser Level', 'Professional laser level for accurate measurements. Perfect for hanging pictures and shelves.', 8.00, 2, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 126, NULL, NULL, NULL),
(83, 4, 'Measuring Tape Set', 'Professional measuring tape set with various lengths. Essential for any project.', 3.00, 5, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 126, NULL, NULL, NULL),
(84, 4, 'Stud Finder', 'Electronic stud finder for locating wall studs. Safely hang heavy items.', 5.00, 2, 'Ben Arous', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 126, NULL, NULL, NULL),
(85, 4, 'BBQ Grill', 'Large gas BBQ grill perfect for parties and gatherings. Includes propane tank.', 30.00, 1, 'Carthage', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 127, NULL, NULL, NULL),
(86, 4, 'Camping Tent', '6-person camping tent with rain cover. Perfect for weekend getaways.', 20.00, 2, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 127, NULL, NULL, NULL),
(87, 4, 'Folding Tables & Chairs', 'Set of 4 folding tables and 20 chairs. Perfect for events and parties.', 40.00, 2, 'Ariana', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 128, NULL, NULL, NULL),
(88, 4, 'Sound System', 'Professional PA system with microphone. Great for parties and presentations.', 35.00, 1, 'Tunis', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 128, NULL, NULL, NULL),
(89, 4, 'Projector & Screen', 'HD projector with 100-inch screen. Perfect for movie nights and presentations.', 25.00, 1, 'La Marsa', 1, '2026-03-01 22:31:23', '2026-03-01 22:31:23', 128, NULL, NULL, NULL);

-- ========================================
-- Contraintes de clés étrangères
-- ========================================

ALTER TABLE `avis`
  ADD CONSTRAINT `FK_8F91ABF0B83297E7` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`);

ALTER TABLE `covoiturage`
  ADD CONSTRAINT `FK_28C79E89F16F4AC6` FOREIGN KEY (`conducteur_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `favorite`
  ADD CONSTRAINT `FK_68C58ED9A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `home`
  ADD CONSTRAINT `FK_71D60CD01FB8D185` FOREIGN KEY (`host_id`) REFERENCES `user` (`id`);

ALTER TABLE `logement`
  ADD CONSTRAINT `FK_F0FD445776C50E4A` FOREIGN KEY (`proprietaire_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_F0FD445712469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `participant`
  ADD CONSTRAINT `FK_D79F6B1162671590` FOREIGN KEY (`covoiturage_id`) REFERENCES `covoiturage` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D79F6B1171A51189` FOREIGN KEY (`passager_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `reservation`
  ADD CONSTRAINT `FK_42C8495558ABF955` FOREIGN KEY (`logement_id`) REFERENCES `logement` (`id`),
  ADD CONSTRAINT `FK_42C84955D8A38199` FOREIGN KEY (`locataire_id`) REFERENCES `user` (`id`);

ALTER TABLE `reset_password_request`
  ADD CONSTRAINT `FK_7CE748AA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `service`
  ADD CONSTRAINT `FK_E19D9AD21FB8D185` FOREIGN KEY (`host_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_E19D9AD212469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `tool`
  ADD CONSTRAINT `FK_20F33ED11FB8D185` FOREIGN KEY (`host_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_20F33ED112469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
