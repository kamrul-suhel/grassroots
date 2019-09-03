# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.27)
# Database: grassroots_beta3
# Generation Time: 2019-08-29 16:01:16 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table account
# ------------------------------------------------------------

DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type_id` int(11) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `sort_code` varchar(255) DEFAULT NULL,
  `is_fc` tinyint(1) NOT NULL,
  `is_academy` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;

INSERT INTO `account` (`id`, `franchise_id`, `club_id`, `title`, `type_id`, `bank_name`, `account_number`, `sort_code`, `is_fc`, `is_academy`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(1,4,11,'Soccer School',1,'Barclays','93514756222222','20-67-90',0,0,'2019-02-25 16:47:08',2,'2019-02-25 16:47:08',83,1),
	(2,5,13,'Natwest Account',1,'Natwest','123456','12-12-12',0,0,'2017-09-15 16:00:06',90,'2017-09-15 16:00:06',90,1),
	(3,5,15,'Natwest Business Account',1,'Natwest','123456789','121545',0,0,'2017-09-21 10:11:18',90,'2017-09-21 10:11:18',90,1),
	(4,6,17,'Main account',1,'Barclays','93512323','20-10-10',0,0,'2017-09-21 10:56:09',95,'2017-09-21 10:56:09',95,1),
	(5,7,18,'Barnet FC',1,'Natwest','12345678','222222',0,0,'2017-09-21 11:13:03',98,'2017-09-21 11:13:03',98,1),
	(7,8,23,'Primary account',1,'Barclays','10101010','102030',0,0,'2017-09-21 14:21:29',105,'2017-09-21 14:21:29',105,1),
	(8,9,24,'Business Account',1,'Natwest','58745789','258871',0,0,'2017-09-21 14:54:49',108,'2017-09-21 14:54:49',108,1),
	(9,10,26,'Soccer School Account',1,'Natwest','12458789','560000',0,0,'2017-09-21 15:44:51',112,'2017-09-21 15:44:51',112,1),
	(10,10,26,'FC Account',1,'Natwest','45457892','542147',0,0,'2017-09-21 15:45:18',112,'2017-09-21 15:45:18',112,1),
	(11,4,11,'Soccer change',2,'Cash','123','123456',0,0,'2019-02-12 17:41:17',2,'2019-02-12 17:41:17',83,1),
	(12,4,28,'FC bank Account',1,'dfsdf','23432343','234323',1,0,'2019-01-07 11:57:32',0,'2019-01-07 11:57:32',2,1),
	(13,4,28,'FC cash Account',2,NULL,NULL,NULL,1,0,'2017-10-04 18:18:41',0,'2017-10-04 18:18:41',0,1),
	(14,4,28,'Academy bank Account',1,'dsfdss','34342342','234323',0,1,'2019-01-07 11:57:25',0,'2019-01-07 11:57:25',2,1),
	(15,4,28,'Academy cash Account',1,'zxczx','23423432','234343',0,1,'2019-01-07 11:57:17',0,'2019-01-07 11:57:17',2,1),
	(16,4,11,'Football Club ',1,'Barclays ','10101010','208976',0,0,'2017-12-15 23:31:10',2,'2017-12-15 22:31:10',2,1),
	(17,11,29,'FC bank Account',1,'Barclays ','30006000','202020',1,0,'2017-10-05 21:06:27',0,'2017-10-05 21:06:27',119,1),
	(18,11,29,'FC cash Account',2,NULL,NULL,NULL,1,0,'2017-10-05 20:47:56',0,'2017-10-05 20:47:56',0,1),
	(19,11,29,'Academy bank Account',1,'Barclays','50004000','203020',0,1,'2017-10-05 21:06:50',0,'2017-10-05 21:06:50',119,1),
	(20,11,29,'Academy cash Account',1,NULL,NULL,NULL,0,1,'2017-10-05 20:47:56',0,'2017-10-05 20:47:56',0,1),
	(21,12,30,'FC bank Account',1,NULL,NULL,NULL,1,0,'2017-10-10 21:59:04',0,'2017-10-10 21:59:04',0,1),
	(22,12,30,'FC cash Account',2,NULL,NULL,NULL,1,0,'2017-10-10 21:59:04',0,'2017-10-10 21:59:04',0,1),
	(23,13,31,'FC bank Account',1,NULL,NULL,NULL,1,0,'2017-10-12 11:40:23',0,'2017-10-12 11:40:23',0,1),
	(24,13,31,'FC cash Account',2,NULL,NULL,NULL,1,0,'2017-10-12 11:40:23',0,'2017-10-12 11:40:23',0,1),
	(25,13,31,'Academy bank Account',1,NULL,NULL,NULL,0,1,'2017-10-12 11:40:23',0,'2017-10-12 11:40:23',0,1),
	(26,13,31,'Academy cash Account',1,NULL,NULL,NULL,0,1,'2017-10-12 11:40:23',0,'2017-10-12 11:40:23',0,1),
	(29,15,38,'FC cash Account',2,NULL,NULL,NULL,1,0,'2018-01-18 19:58:23',0,'2018-01-18 19:58:23',0,1),
	(30,15,38,'Academy bank Account',1,'HSBC','56565656','301634',0,1,'2018-01-22 01:57:50',0,'2018-01-22 00:57:50',138,1),
	(31,15,38,'Academy cash Account',1,NULL,NULL,NULL,0,1,'2018-01-18 19:58:23',0,'2018-01-18 19:58:23',0,1),
	(33,4,11,'FC cash Account',2,NULL,NULL,NULL,1,0,'2018-01-29 16:00:23',0,'2018-01-29 16:00:23',0,1),
	(34,4,11,'Academy bank Account',1,'dfhgfhg','5354654','354654',0,1,'2019-02-12 11:30:51',0,'2019-02-12 11:30:51',254,1),
	(36,4,36,'FC bank Account',1,'Test','132456789','121212',1,0,'2018-01-30 14:48:31',0,'2018-01-30 13:48:31',2,1),
	(37,4,36,'FC cash Account',2,'Test',NULL,NULL,1,0,'2018-01-30 14:50:43',0,'2018-01-30 13:50:43',2,1),
	(38,4,32,'FC bank Account',1,'Natwest','12345678','789878',1,0,'2018-12-18 17:04:49',0,'2018-12-18 17:04:49',2,1),
	(39,4,32,'FC cash Account',2,NULL,NULL,NULL,1,0,'2018-02-06 12:06:00',0,'2018-02-06 12:06:00',0,1),
	(40,4,32,'Academy bank Account',1,'Test','12345678','123456',0,1,'2018-09-13 11:31:04',0,'2018-09-13 11:31:04',2,1),
	(41,4,32,'Academy cash Account',1,'Natwest','98765432','989898',0,1,'2018-12-18 17:05:00',0,'2018-12-18 17:05:00',2,1),
	(42,4,45,'Football Club bank account',1,'Barclays','123456789','20-20-20',1,0,'2018-02-06 12:20:55',0,'2018-02-06 12:20:55',2,1),
	(43,4,45,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2018-02-06 12:21:02',0,'2018-02-06 12:21:02',2,1),
	(44,4,45,'Soccer School bank account',1,'Natwest','123456789','121212',0,1,'2018-02-06 12:22:00',0,'2018-02-06 12:22:00',2,1),
	(45,4,45,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2018-02-06 12:13:29',0,'2018-02-06 12:13:29',0,1),
	(46,4,45,'Saving account',3,NULL,NULL,NULL,0,0,'2018-02-06 12:22:13',2,'2018-02-06 12:22:13',2,1),
	(48,4,46,'Football Club bank account',1,'Natwest','12345678','12-12-34',1,0,'2018-02-28 11:56:45',0,'2018-02-28 11:56:45',2,1),
	(49,4,46,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2018-02-06 15:35:06',0,'2018-02-06 15:35:06',0,1),
	(50,4,46,'Soccer School bank account',1,'Natwest','12345678','123456',0,1,'2018-02-28 11:57:10',0,'2018-02-28 11:57:10',2,1),
	(51,4,46,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2018-02-06 15:35:06',0,'2018-02-06 15:35:06',0,1),
	(52,4,51,'Football Club bank account',1,'Natwest','787654397','348978',1,0,'2018-07-05 11:50:02',0,'2018-07-05 11:50:02',2,1),
	(53,4,51,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2018-07-05 11:50:11',0,'2018-07-05 11:50:11',2,1),
	(54,4,51,'Soccer School bank account',1,'Barclays','78765654','787878',0,1,'2018-07-05 11:50:23',0,'2018-07-05 11:50:23',2,1),
	(55,4,51,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2018-07-05 11:51:33',0,'2018-07-05 11:51:33',2,1),
	(56,4,52,'Soccer School bank account',1,'bob','65465','5465',0,1,'2018-09-17 14:14:35',0,'2018-09-17 14:14:35',2,1),
	(57,4,52,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2018-09-14 16:16:25',0,'2018-09-14 16:16:25',0,1),
	(58,4,51,'Recruitment',2,NULL,NULL,NULL,0,0,'2018-09-17 12:31:57',2,'2018-09-17 12:31:57',2,1),
	(59,4,53,'Soccer School bank account',1,'bob','864968465','51651',0,1,'2018-09-17 12:40:19',0,'2018-09-17 12:40:19',2,1),
	(61,4,53,'is this the way to Amarillo',3,NULL,NULL,NULL,0,0,'2018-09-17 14:10:48',2,'2018-09-17 14:10:48',2,1),
	(62,19,54,'Football Club bank account',1,'Natwest','12345678','123456',1,0,'2018-09-26 17:43:28',0,'2018-09-26 17:43:28',178,1),
	(63,19,54,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2018-09-26 17:37:46',0,'2018-09-26 17:37:46',0,1),
	(64,19,54,'Soccer School bank account',1,'Natwest','12345678','123456',0,1,'2018-09-26 17:43:58',0,'2018-09-26 17:43:58',178,1),
	(65,19,54,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2018-09-26 17:37:46',0,'2018-09-26 17:37:46',0,1),
	(66,4,34,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2018-11-28 17:34:59',0,'2018-11-28 17:34:59',0,1),
	(67,4,34,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2018-11-28 17:34:59',0,'2018-11-28 17:34:59',0,1),
	(68,27,56,'GFA Enfield FC',1,'HSBC','50564513','501255',1,0,'2018-12-04 02:12:53',0,'2018-12-04 02:12:53',191,1),
	(69,27,56,'GFA Enfield FC',2,NULL,NULL,NULL,1,0,'2018-12-04 02:12:46',0,'2018-12-04 02:12:46',191,1),
	(70,27,56,'GFA Enfield Academy',3,NULL,NULL,NULL,0,1,'2018-12-04 02:13:04',0,'2018-12-04 02:13:04',191,1),
	(71,27,56,'GFA Enfield Academy',2,NULL,NULL,NULL,0,1,'2018-12-04 02:13:19',0,'2018-12-04 02:13:19',191,1),
	(72,27,56,'TEST',3,NULL,NULL,NULL,0,0,'2018-12-04 02:29:06',191,'2018-12-04 02:29:06',191,1),
	(73,4,28,'Test',2,NULL,NULL,NULL,0,0,'2019-01-07 11:50:39',2,'2019-01-07 11:50:39',2,1),
	(74,4,28,'Test2',3,NULL,NULL,NULL,0,0,'2019-01-07 11:51:02',2,'2019-01-07 11:51:02',2,1),
	(75,4,47,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-01-25 16:34:58',0,'2019-01-25 16:34:58',0,1),
	(76,4,47,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-01-25 16:34:58',0,'2019-01-25 16:34:58',0,1),
	(77,4,40,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-01-30 10:26:24',0,'2019-01-30 10:26:24',0,1),
	(78,4,40,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-01-30 10:26:24',0,'2019-01-30 10:26:24',0,1),
	(79,4,40,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-01-30 10:26:24',0,'2019-01-30 10:26:24',0,1),
	(80,4,40,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-01-30 10:26:24',0,'2019-01-30 10:26:24',0,1),
	(81,4,47,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-01-30 12:52:02',0,'2019-01-30 12:52:02',0,1),
	(82,4,47,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-01-30 12:52:02',0,'2019-01-30 12:52:02',0,1),
	(83,4,33,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-01-30 13:36:43',0,'2019-01-30 13:36:43',0,1),
	(84,4,33,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-01-30 13:36:43',0,'2019-01-30 13:36:43',0,1),
	(85,4,41,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-01-30 14:17:11',0,'2019-01-30 14:17:11',0,1),
	(86,4,41,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-01-30 14:17:11',0,'2019-01-30 14:17:11',0,1),
	(87,4,41,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-01-30 14:17:11',0,'2019-01-30 14:17:11',0,1),
	(88,4,41,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-01-30 14:17:11',0,'2019-01-30 14:17:11',0,1),
	(89,4,35,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-01-30 14:23:07',0,'2019-01-30 14:23:07',0,1),
	(90,4,35,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-01-30 14:23:07',0,'2019-01-30 14:23:07',0,1),
	(91,4,35,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-01-30 14:23:07',0,'2019-01-30 14:23:07',0,1),
	(92,4,35,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-01-30 14:23:07',0,'2019-01-30 14:23:07',0,1),
	(93,4,33,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-01-30 14:31:52',0,'2019-01-30 14:31:52',0,1),
	(94,4,33,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-01-30 14:31:52',0,'2019-01-30 14:31:52',0,1),
	(95,4,71,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-02-04 10:13:36',0,'2019-02-04 10:13:36',0,1),
	(96,4,71,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-02-04 10:13:36',0,'2019-02-04 10:13:36',0,1),
	(97,4,63,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-02-04 10:21:26',0,'2019-02-04 10:21:26',0,1),
	(98,4,63,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-02-04 10:21:26',0,'2019-02-04 10:21:26',0,1),
	(99,4,74,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-02-05 10:26:57',0,'2019-02-05 10:26:57',0,1),
	(100,4,74,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-02-05 10:26:57',0,'2019-02-05 10:26:57',0,1),
	(101,39,75,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-02-06 10:09:47',0,'2019-02-06 10:09:47',0,1),
	(102,39,75,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-02-06 10:09:47',0,'2019-02-06 10:09:47',0,1),
	(103,43,78,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-02-09 01:14:50',0,'2019-02-09 01:14:50',0,1),
	(104,43,78,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-02-09 01:14:50',0,'2019-02-09 01:14:50',0,1),
	(105,45,79,'CASH ACCOUNT',2,NULL,NULL,NULL,0,0,'2019-02-09 02:17:32',273,'2019-02-09 02:17:32',273,1),
	(106,45,79,'BANK ACCOUNT',1,'HSBC','12345678','128965',0,0,'2019-02-09 02:18:00',273,'2019-02-09 02:18:00',273,1),
	(130,47,82,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-02-15 00:59:26',0,'2019-02-15 00:59:26',0,1),
	(131,47,82,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-02-15 00:59:26',0,'2019-02-15 00:59:26',0,1),
	(132,47,82,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-02-15 00:59:26',0,'2019-02-15 00:59:26',0,1),
	(133,47,82,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-02-15 00:59:26',0,'2019-02-15 00:59:26',0,1),
	(134,4,83,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-02-21 09:40:43',0,'2019-02-21 09:40:43',0,1),
	(135,4,83,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-02-21 09:40:43',0,'2019-02-21 09:40:43',0,1),
	(136,4,11,'London Tigers 2',2,NULL,NULL,NULL,0,0,'2019-03-11 15:14:55',83,'2019-03-11 15:14:55',83,1),
	(137,62,86,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-03-14 21:08:43',0,'2019-03-14 21:08:43',0,1),
	(138,62,86,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-03-14 21:08:43',0,'2019-03-14 21:08:43',0,1),
	(139,62,86,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-03-14 21:08:43',0,'2019-03-14 21:08:43',0,1),
	(140,62,86,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-03-14 21:08:43',0,'2019-03-14 21:08:43',0,1),
	(141,67,88,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-03-19 11:12:09',0,'2019-03-19 11:12:09',0,1),
	(142,67,88,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-03-19 11:12:09',0,'2019-03-19 11:12:09',0,1),
	(143,67,88,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-03-19 11:12:09',0,'2019-03-19 11:12:09',0,1),
	(144,67,88,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-03-19 11:12:09',0,'2019-03-19 11:12:09',0,1),
	(145,4,93,'Soccer School bank account',1,'Loyds','12334536','1234356',0,1,'2019-05-31 11:30:36',0,'2019-05-31 11:30:36',327,1),
	(146,4,93,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-03-22 11:20:57',0,'2019-03-22 11:20:57',0,1),
	(147,4,93,'Football Club bank account',1,'Natwest','123123122312','1231213',1,0,'2019-04-04 10:17:22',0,'2019-04-04 10:17:22',327,1),
	(148,4,93,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-04-01 10:29:16',0,'2019-04-01 10:29:16',0,1),
	(149,4,84,'New account',1,'Loyds','1234567','7654321',0,0,'2019-04-04 09:55:52',294,'2019-04-04 09:55:52',294,1),
	(150,4,37,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-05-22 13:34:32',0,'2019-05-22 13:34:32',0,1),
	(151,4,37,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-05-22 13:34:32',0,'2019-05-22 13:34:32',0,1),
	(152,4,37,'Soccer School directors account',2,NULL,NULL,NULL,0,1,'2019-05-22 13:34:32',0,'2019-05-22 13:34:32',0,1),
	(153,4,44,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-05-22 13:57:48',0,'2019-05-22 13:57:48',0,1),
	(154,4,44,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-05-22 13:57:48',0,'2019-05-22 13:57:48',0,1),
	(155,4,44,'Soccer School directors account',2,NULL,NULL,NULL,0,1,'2019-05-22 13:57:48',0,'2019-05-22 13:57:48',0,1),
	(156,4,93,'Savings',3,NULL,NULL,NULL,0,0,'2019-05-29 17:21:35',327,'2019-05-29 17:21:35',327,1),
	(157,135,95,'Soccer School bank account',1,'Natwest','22','22',0,1,'2019-05-29 17:34:18',0,'2019-05-29 17:34:18',394,1),
	(158,135,95,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-05-29 17:30:14',0,'2019-05-29 17:30:14',0,1),
	(159,135,95,'Soccer School directors account',2,NULL,NULL,NULL,0,1,'2019-05-29 17:30:14',0,'2019-05-29 17:30:14',0,1),
	(160,144,101,'Bank account',1,'Loyds','12345678','123456',0,0,'2019-05-30 15:38:12',410,'2019-05-30 15:38:12',410,1),
	(161,146,107,'Business',1,'Natwest','12345678','123456',0,0,'2019-07-19 10:33:32',424,'2019-07-19 10:33:32',424,1),
	(162,146,107,'Petty Cash',2,NULL,NULL,NULL,0,0,'2019-07-19 10:33:41',424,'2019-07-19 10:33:41',424,1),
	(163,146,107,'Savings AC',3,'Barclays','12345678','121212',0,0,'2019-07-19 10:34:05',424,'2019-07-19 10:34:05',424,1),
	(164,147,108,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-07-31 17:34:57',0,'2019-07-31 17:34:57',0,1),
	(165,147,108,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-07-31 17:34:57',0,'2019-07-31 17:34:57',0,1),
	(166,147,108,'Soccer School directors account',2,NULL,NULL,NULL,0,1,'2019-07-31 17:34:57',0,'2019-07-31 17:34:57',0,1),
	(167,149,112,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-08-22 15:35:47',0,'2019-08-22 15:35:47',0,1),
	(168,149,112,'Football Club cash account',2,NULL,NULL,NULL,1,0,'2019-08-22 15:35:47',0,'2019-08-22 15:35:47',0,1),
	(169,149,112,'Soccer School bank account',1,NULL,NULL,NULL,0,1,'2019-08-22 15:35:47',0,'2019-08-22 15:35:47',0,1),
	(170,149,112,'Soccer School cash account',2,NULL,NULL,NULL,0,1,'2019-08-22 15:35:47',0,'2019-08-22 15:35:47',0,1),
	(171,149,112,'Soccer School directors account',2,NULL,NULL,NULL,0,1,'2019-08-22 15:35:47',0,'2019-08-22 15:35:47',0,1),
	(172,145,105,'Soccer School bank account',1,'lll',';;;','lll',0,1,'2019-08-29 11:56:02',0,'2019-08-29 11:56:02',418,1),
	(173,145,105,'Soccer School cash account',3,NULL,NULL,NULL,0,1,'2019-08-29 12:37:06',0,'2019-08-29 12:37:06',418,1),
	(174,145,105,'Soccer School directors account',2,NULL,NULL,NULL,0,1,'2019-08-22 16:18:40',0,'2019-08-22 16:18:40',0,1),
	(175,145,105,'Football Club bank account',1,NULL,NULL,NULL,1,0,'2019-08-23 11:02:57',0,'2019-08-23 11:02:57',0,1),
	(176,145,105,'Football Club cash account',3,NULL,NULL,NULL,1,0,'2019-08-29 12:37:21',0,'2019-08-29 12:37:21',418,1),
	(177,145,105,'account name',2,NULL,NULL,NULL,0,0,'2019-08-28 12:21:58',418,'2019-08-28 12:21:58',418,1);

/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table account_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `account_type`;

CREATE TABLE `account_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `account_type` WRITE;
/*!40000 ALTER TABLE `account_type` DISABLE KEYS */;

INSERT INTO `account_type` (`id`, `franchise_id`, `club_id`, `title`, `created_at`, `created_by`, `updated_at`, `updated_by`)
VALUES
	(1,0,0,'Bank account','2017-09-21 10:54:25',0,'2017-09-21 10:54:58',0),
	(2,0,0,'Cash account','2017-09-21 10:54:39',0,'2017-09-21 10:54:59',0),
	(3,0,0,'Saving account','2017-09-21 10:54:47',0,'2017-09-21 10:54:59',0);

/*!40000 ALTER TABLE `account_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table address_book
# ------------------------------------------------------------

DROP TABLE IF EXISTS `address_book`;

CREATE TABLE `address_book` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `address` text,
  `city` varchar(255) DEFAULT NULL,
  `postcode` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT '',
  `position` varchar(255) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT '',
  `mobile` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT '',
  `note` text,
  `payment_method_id` int(10) unsigned DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `lat` decimal(12,9) DEFAULT NULL,
  `lng` decimal(12,9) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `address_book` WRITE;
/*!40000 ALTER TABLE `address_book` DISABLE KEYS */;

INSERT INTO `address_book` (`address_id`, `franchise_id`, `club_id`, `type_id`, `status`, `first_name`, `last_name`, `contact_name`, `address`, `city`, `postcode`, `title`, `position`, `telephone`, `mobile`, `email`, `note`, `payment_method_id`, `company`, `created_at`, `created_by`, `updated_at`, `updated_by`, `lat`, `lng`)
VALUES
	(9152,145,105,11,1,NULL,NULL,'Jason Green',NULL,NULL,NULL,'Jason Green',NULL,'01622296755',NULL,'jason@xanda.net',NULL,NULL,NULL,'2019-07-05 10:56:00',417,'2019-07-05 10:56:00',417,NULL,NULL),
	(9153,145,106,11,1,NULL,NULL,'Jason Green',NULL,NULL,NULL,'Jason Green',NULL,'01622296755',NULL,'jason@xanda.net',NULL,NULL,NULL,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21',417,NULL,NULL),
	(9154,145,105,5,1,NULL,NULL,'Unai Emery Etxegoien','Spain','Hondarribia','IG11 9AP','Unai Emery Etxegoien',NULL,'123456789','098765432','unai@arsenal.net',NULL,NULL,NULL,'2019-07-05 11:34:29',418,'2019-07-05 11:34:29',418,0.000000000,0.000000000),
	(9155,145,105,3,1,'Bracken  Norman','Bracken  Norman','Bracken  Norman Bracken  Norman','Highgate ','London ','N6','Muswell Hill Road ','Coach','07786481259','07786481259',' littlestarsfa@icloud.com',NULL,NULL,'Little stars coaching','2019-07-05 12:54:00',418,'2019-08-27 11:10:59',418,0.000000000,0.000000000),
	(9156,145,105,4,1,'Dan','Joe test','Dan Joe test','75 Evesham road','undefinedw','N11 2RR','Dan Joe test',NULL,'08081 570000','07700 900000','dan@xanda.net',NULL,NULL,NULL,'2019-07-05 13:15:18',418,'2019-08-29 12:56:07',421,0.000000000,0.000000000),
	(9157,145,105,4,1,'PAarent','Kane','PAarent Kane','','testing123','aaa','PAarent Kane',NULL,'02087878787','07878787887','parent@xanda.net',NULL,NULL,NULL,'2019-07-08 11:56:53',422,'2019-08-29 12:02:29',422,0.000000000,0.000000000),
	(9158,146,107,11,1,NULL,NULL,'Mauricio Pochatino',NULL,NULL,NULL,'Mauricio Pochatino',NULL,'0787898789',NULL,'poch@xanda.net',NULL,NULL,NULL,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32',423,NULL,NULL),
	(9159,146,107,11,1,NULL,NULL,'Daniel Levy',NULL,NULL,NULL,'Daniel Levy',NULL,'02085555555',NULL,'daniel@xanda.net',NULL,NULL,NULL,'2019-07-19 09:54:35',423,'2019-07-19 09:54:35',423,NULL,NULL),
	(9160,146,107,5,1,NULL,NULL,'Osvaldo  Ardiles','96 Great North Road','Buenas Aires','ARG 123','Osvaldo  Ardiles',NULL,'0789878788','07878787889','ossie@xanda.net',NULL,NULL,NULL,'2019-07-19 10:16:16',424,'2019-07-19 11:31:59',424,0.000000000,0.000000000),
	(9161,146,107,3,1,'Frank','Smith','Frank Smith','Enfield','London','EN3 2SD','Enfield School Fields','Business Manager','08793780973','0787932489','fran@smith.com',NULL,NULL,'Enfield Primary School','2019-07-19 10:52:04',424,'2019-07-19 10:52:04',424,0.000000000,0.000000000),
	(9162,146,107,6,1,'Dermot','Gallagher','Dermot Gallagher',NULL,NULL,NULL,NULL,'Head Ref','08787987879','07789737890','dermot@xanda.net',NULL,NULL,'Fef United','2019-07-19 11:15:16',424,'2019-07-19 11:15:16',424,0.000000000,0.000000000),
	(9163,146,107,9,1,'Frank','Officeman','Frank Officeman',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2019-07-19 11:16:13',424,'2019-07-19 11:16:13',424,0.000000000,0.000000000),
	(9164,146,107,5,1,NULL,NULL,'Glenn Hoddle','100 Tottenham High Road, Tottenham','London','N20 123','Glenn Hoddle',NULL,'02085555555',NULL,'glenn@xanda.net',NULL,NULL,NULL,'2019-07-19 11:45:57',424,'2019-07-19 11:45:57',424,0.000000000,0.000000000),
	(9165,146,107,4,1,'Daddy','Kane','Daddy Kane','','undefined','','Daddy Kane',NULL,'020887878979','0789707987','daddy@xanda.net',NULL,NULL,NULL,'2019-07-19 12:01:01',0,'2019-07-19 12:01:01',0,0.000000000,0.000000000),
	(9166,145,105,5,1,NULL,NULL,'Shazz Ahmed','45 Romford road','Whitechaple','E1 6EH','Shazz Ahmed',NULL,'01622296755','01622296755','coach@shazz.net',NULL,NULL,NULL,'2019-07-19 15:29:23',418,'2019-08-27 11:28:42',418,0.000000000,0.000000000),
	(9167,147,108,11,1,'Dr','Dre','Dr Dre',NULL,NULL,NULL,'Dr Dre',NULL,'55543251',NULL,'drdre@icecube.com',NULL,NULL,NULL,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46',430,NULL,NULL),
	(9168,147,108,11,1,'Ice','Cube','Ice Cube',NULL,NULL,NULL,'Ice Cube',NULL,'5551234',NULL,'icecube@icecube.com',NULL,NULL,NULL,'2019-07-31 17:34:48',430,'2019-07-31 17:34:48',430,NULL,NULL),
	(9169,4,109,11,1,'France','France','France France',NULL,NULL,NULL,'France France',NULL,'34253',NULL,'france@france.com',NULL,NULL,NULL,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39',2,NULL,NULL),
	(9170,4,110,11,1,'France','France','France France',NULL,NULL,NULL,'France France',NULL,'34253',NULL,'france@france.com',NULL,NULL,NULL,'2019-07-31 18:08:37',2,'2019-07-31 18:08:37',2,NULL,NULL),
	(9171,145,111,11,1,'kamrul','ahmed','kamrul ahmed',NULL,NULL,NULL,'kamrul ahmed',NULL,'01622296755',NULL,'kamrul@xanda.net',NULL,NULL,NULL,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29',417,NULL,NULL),
	(9172,145,105,12,1,NULL,NULL,'Alex Ferguson','UK','Endfield','N11 2RR','Alex Ferguson',NULL,'12345678909','07896543215','alexferguson@xanda.net',NULL,NULL,NULL,'2019-08-14 13:10:45',418,'2019-08-14 13:10:45',418,0.000000000,0.000000000),
	(9173,145,105,11,1,'First name','Last name','First name Last name','Address','city','postcode','Location','position','02934028','20934820398','kamrul@xanda.net',NULL,NULL,'Organisation','2019-08-20 17:49:05',418,'2019-08-20 17:49:05',418,0.000000000,0.000000000),
	(9174,145,105,5,0,'kamrul','ahmed','kamrul ahmed','Bound green, 75 evesham road, 75 evesham road','Wood green','N11 2RR','Address title','Professional Footballer','01622296755','123','kamrul@xanda.net',NULL,NULL,'Xanda Organisation test','2019-08-20 17:50:09',418,'2019-08-29 11:46:14',418,0.000000000,0.000000000),
	(9175,145,105,3,1,'daryan2','amin2','daryan2 amin2','Bound green, 75 evesham road, 75 evesham road','Wood green','N11 2RR','Address title',NULL,'01622296755',NULL,'kamrul@xanda.net',NULL,NULL,'Xanda Organisation test','2019-08-20 17:53:35',418,'2019-08-29 10:41:27',418,0.000000000,0.000000000),
	(9176,145,105,3,1,'firstName','LastName','firstName LastName','asd','asd','nw3 3qr','Address title',NULL,'07481288292',NULL,'asdasd@asdasd.com',NULL,NULL,NULL,'2019-08-21 10:04:50',418,'2019-08-29 11:18:25',418,0.000000000,0.000000000),
	(9177,145,105,3,1,'Jon',NULL,'Jon ',NULL,NULL,NULL,'Jon',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2019-08-21 10:05:24',418,'2019-08-21 10:05:24',418,0.000000000,0.000000000),
	(9178,145,105,3,1,'Dan',NULL,'Dan ',NULL,NULL,NULL,'Redcliffe',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2019-08-21 16:19:09',418,'2019-08-21 16:19:09',418,0.000000000,0.000000000),
	(9179,145,105,3,1,'Raul',NULL,'Raul ',NULL,NULL,NULL,'Whitefield',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2019-08-21 16:27:23',418,'2019-08-21 16:27:23',418,0.000000000,0.000000000),
	(9180,145,105,3,0,'firstName','LastName','firstName LastName','asd','asd','nw3 3qr','Burry',NULL,'07481288292',NULL,'asdasd@asdasd.com',NULL,NULL,NULL,'2019-08-21 17:04:25',418,'2019-08-29 12:56:48',418,0.000000000,0.000000000),
	(9181,149,112,11,1,'Daryan','Amin','Daryan Amin',NULL,NULL,NULL,'Daryan Amin',NULL,'07481822797',NULL,'daryan@xanda.net',NULL,NULL,NULL,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53',438,NULL,NULL),
	(9182,149,112,4,1,'Parent','Parent','parent parent','','undefined','','Parent Parent',NULL,'','07481822797','parents@xanda.net',NULL,NULL,NULL,'2019-08-22 10:42:36',0,'2019-08-22 10:42:36',0,0.000000000,0.000000000),
	(9183,149,112,12,1,NULL,NULL,'coach coach','north london','london','n22 r33','coach coach',NULL,'07481822797','07481822797','coach2@xanda.net',NULL,NULL,NULL,'2019-08-22 10:47:28',439,'2019-08-22 10:47:28',439,0.000000000,0.000000000),
	(9184,150,113,11,1,'Test','Test','Test Test',NULL,NULL,NULL,'Test Test',NULL,'012381289',NULL,'test@xanda.net',NULL,NULL,NULL,'2019-08-23 11:25:26',442,'2019-08-23 11:25:26',442,NULL,NULL),
	(9185,149,114,11,1,'Daryan','Amin','Daryan Amin',NULL,NULL,NULL,'Daryan Amin',NULL,'07481822797',NULL,'daryan@xanda.net',NULL,NULL,NULL,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36',438,NULL,NULL),
	(9186,149,115,11,1,'Daryan','Amin','Daryan Amin',NULL,NULL,NULL,'Daryan Amin',NULL,'07481822797',NULL,'daryan@xanda.net',NULL,NULL,NULL,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49',438,NULL,NULL),
	(9187,149,116,11,1,'Daryan','Amin','Daryan Amin',NULL,NULL,NULL,'Daryan Amin',NULL,'07481822797',NULL,'daryan@xanda.net',NULL,NULL,NULL,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36',438,NULL,NULL),
	(9188,149,117,11,1,'Daryan','Amin','Daryan Amin',NULL,NULL,NULL,'Daryan Amin',NULL,'07481822797',NULL,'daryan@xanda.net',NULL,NULL,NULL,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30',438,NULL,NULL),
	(9189,149,118,11,1,'Daryan','Amin','Daryan Amin',NULL,NULL,NULL,'Daryan Amin',NULL,'07481822797',NULL,'daryan@xanda.net',NULL,NULL,NULL,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14',438,NULL,NULL),
	(9190,149,119,11,1,'Daryan','Amin','Daryan Amin',NULL,NULL,NULL,'Daryan Amin',NULL,'07481822797',NULL,'daryan@xanda.net',NULL,NULL,NULL,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18',438,NULL,NULL),
	(9191,145,105,8,1,'test',NULL,'test ',NULL,NULL,NULL,'test',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2019-08-28 12:32:16',418,'2019-08-28 12:32:16',418,0.000000000,0.000000000),
	(9192,145,105,12,1,'aaa',NULL,'aaa ',NULL,NULL,NULL,'aaa',NULL,NULL,NULL,'aaa',NULL,NULL,NULL,'2019-08-28 12:32:40',418,'2019-08-28 12:32:40',418,0.000000000,0.000000000),
	(9193,145,105,12,1,'test1',NULL,'test1 ',NULL,NULL,NULL,'test1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2019-08-28 12:38:42',418,'2019-08-28 12:38:42',418,0.000000000,0.000000000),
	(9194,0,0,0,1,'FirstName','Xanda123','FirstName Xanda123','asd','asd','nw3 3qr','FirstName Xanda123',NULL,'07481288292',NULL,'asdasd@asdasd.com',NULL,NULL,NULL,'2019-08-29 13:01:47',417,'2019-08-29 13:01:47',417,NULL,NULL);

/*!40000 ALTER TABLE `address_book` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table address_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `address_type`;

CREATE TABLE `address_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`type_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `address_type` WRITE;
/*!40000 ALTER TABLE `address_type` DISABLE KEYS */;

INSERT INTO `address_type` (`type_id`, `franchise_id`, `club_id`, `title`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(1,0,0,'School','2017-05-17 11:25:46',2,'2017-07-26 15:24:44',2,1),
	(2,0,0,'Other team','2017-05-23 11:00:44',2,'2017-07-26 15:54:54',2,1),
	(3,0,0,'Venue','2017-06-28 15:00:13',2,'2017-07-26 15:24:43',2,1),
	(4,0,0,'Guardian','2017-07-26 15:18:57',2,'2017-07-26 15:24:42',2,1),
	(5,0,0,'External Coach','2017-07-26 15:19:18',2,'2019-07-19 16:32:09',2,1),
	(6,0,0,'Referee','2017-07-26 15:52:52',2,'2017-07-26 15:24:42',2,1),
	(7,0,0,'League officer','2017-07-26 15:53:12',2,'2017-07-26 15:54:57',2,1),
	(8,0,0,'County FA','2017-07-26 15:53:25',2,'2017-07-26 15:24:42',2,1),
	(9,0,0,'The FA','2017-07-26 15:53:34',2,'2017-07-26 15:53:35',2,1),
	(10,0,0,'Other','2017-07-26 15:53:49',2,'2017-07-26 15:53:50',2,1),
	(11,0,0,'Admin','2017-10-02 15:00:24',2,'0000-00-00 00:00:00',2,1),
	(12,0,0,'Coach','2019-08-14 13:10:34',0,'2019-08-14 13:10:34',0,1);

/*!40000 ALTER TABLE `address_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table agegroup
# ------------------------------------------------------------

DROP TABLE IF EXISTS `agegroup`;

CREATE TABLE `agegroup` (
  `agegroup_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `max_age` int(2) unsigned NOT NULL,
  PRIMARY KEY (`agegroup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `agegroup` WRITE;
/*!40000 ALTER TABLE `agegroup` DISABLE KEYS */;

INSERT INTO `agegroup` (`agegroup_id`, `title`, `max_age`)
VALUES
	(1,'Under 4s',4),
	(2,'Under 5s',5),
	(3,'Under 6s',6),
	(4,'Under 7s',7),
	(5,'Under 8s',8),
	(6,'Under 9s',9),
	(7,'Under 10s',10),
	(8,'Under 11s',11),
	(9,'Under 12s',12),
	(10,'Under 13s',13),
	(11,'Under 14s',14),
	(12,'Under 15s',15),
	(13,'Under 16s',16),
	(14,'Under 17s',17),
	(15,'Under 18s',18),
	(16,'Under 19s',19),
	(17,'Under 20s',20),
	(18,'Under 21s',21);

/*!40000 ALTER TABLE `agegroup` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table assessment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `assessment`;

CREATE TABLE `assessment` (
  `assessment_id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `assessment` WRITE;
/*!40000 ALTER TABLE `assessment` DISABLE KEYS */;

INSERT INTO `assessment` (`assessment_id`, `club_id`, `title`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(8,105,'Do you like the food?','2019-07-08 11:48:39',418,'2019-07-08 11:48:39',0,1),
	(9,105,'asdf','2019-07-08 12:29:05',418,'2019-07-08 12:29:05',0,1),
	(10,105,'Kit Item','2019-07-08 13:21:27',418,'2019-07-08 13:21:27',0,1),
	(11,105,'Kit item','2019-07-08 13:26:12',418,'2019-07-08 13:26:12',0,1),
	(12,107,'Trainign Session','2019-07-19 10:42:49',424,'2019-07-19 10:42:49',0,1),
	(13,107,'Match Assessment','2019-07-19 10:45:50',424,'2019-07-19 10:45:50',0,1);

/*!40000 ALTER TABLE `assessment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table assessment_answer
# ------------------------------------------------------------

DROP TABLE IF EXISTS `assessment_answer`;

CREATE TABLE `assessment_answer` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `assessment_user` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `assessment_user` (`assessment_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `assessment_answer` WRITE;
/*!40000 ALTER TABLE `assessment_answer` DISABLE KEYS */;

INSERT INTO `assessment_answer` (`answer_id`, `assessment_user`, `content`, `created_at`, `created_by`)
VALUES
	(148,47,'Yes','2019-07-08 11:50:40',418),
	(149,47,'No','2019-07-08 11:50:40',418),
	(150,47,'dd','2019-07-08 11:50:40',418),
	(154,48,'Yes','2019-07-08 15:31:41',418),
	(155,48,'No','2019-07-08 15:31:41',418),
	(156,48,'tes','2019-07-08 15:31:41',418),
	(157,49,'2','2019-07-19 10:43:27',424),
	(158,49,'Yes','2019-07-19 10:43:27',424),
	(159,49,'Yes','2019-07-19 10:43:27',424),
	(160,49,'Coudl be a little more hands on during shooting practice. ','2019-07-19 10:43:27',424),
	(169,50,'2','2019-07-19 10:44:36',424),
	(170,50,'No','2019-07-19 10:44:36',424),
	(171,50,'No','2019-07-19 10:44:36',424),
	(172,50,'Love him','2019-07-19 10:44:36',424);

/*!40000 ALTER TABLE `assessment_answer` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table assessment_question
# ------------------------------------------------------------

DROP TABLE IF EXISTS `assessment_question`;

CREATE TABLE `assessment_question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `assessment_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `is_multiple_answers` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `assessment_question` WRITE;
/*!40000 ALTER TABLE `assessment_question` DISABLE KEYS */;

INSERT INTO `assessment_question` (`question_id`, `assessment_id`, `club_id`, `title`, `is_multiple_answers`, `created_at`, `created_by`, `updated_at`, `updated_by`, `order`, `status`)
VALUES
	(72,8,105,'Do you eat meet?',1,'2019-07-08 11:48:39',418,'2019-07-08 11:48:39',0,1,1),
	(73,8,105,'So you drink alcohol',1,'2019-07-08 11:48:39',418,'2019-07-08 11:48:39',0,1,1),
	(74,8,105,'What would you change?',0,'2019-07-08 11:48:39',418,'2019-07-08 11:48:39',0,1,1),
	(75,9,105,'newclub2',0,'2019-07-08 12:29:05',418,'2019-07-08 12:29:05',0,1,1),
	(76,10,105,'Do you have Tshirt',1,'2019-07-08 13:21:27',418,'2019-07-08 13:21:27',0,1,1),
	(77,10,105,'Do you have Shoe',1,'2019-07-08 13:21:27',418,'2019-07-08 13:21:27',0,1,1),
	(78,11,105,'Do you have TShirt',1,'2019-07-08 13:26:12',418,'2019-07-08 13:26:12',0,1,1),
	(79,11,105,'Do you have shoe',1,'2019-07-08 13:26:13',418,'2019-07-08 13:26:13',0,1,1),
	(80,12,107,'How many skills do they do?',1,'2019-07-19 10:42:49',424,'2019-07-19 10:42:49',0,1,1),
	(81,12,107,'Were the kids engaged?',1,'2019-07-19 10:42:49',424,'2019-07-19 10:42:49',0,1,1),
	(82,12,107,'Did they bring a whistle?',1,'2019-07-19 10:42:49',424,'2019-07-19 10:42:49',0,1,1),
	(83,12,107,'Overall impression',0,'2019-07-19 10:42:49',424,'2019-07-19 10:42:49',0,1,1),
	(84,13,107,'Did they bring a ref?',1,'2019-07-19 10:45:50',424,'2019-07-19 10:45:50',0,1,1),
	(85,13,107,'Were subs used?',1,'2019-07-19 10:45:50',424,'2019-07-19 10:45:50',0,1,1);

/*!40000 ALTER TABLE `assessment_question` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table assessment_question_option
# ------------------------------------------------------------

DROP TABLE IF EXISTS `assessment_question_option`;

CREATE TABLE `assessment_question_option` (
  `option_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `order` int(11) NOT NULL,
  PRIMARY KEY (`option_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `assessment_question_option` WRITE;
/*!40000 ALTER TABLE `assessment_question_option` DISABLE KEYS */;

INSERT INTO `assessment_question_option` (`option_id`, `question_id`, `title`, `order`)
VALUES
	(54,72,'Yes',1),
	(55,72,'No',1),
	(56,72,'Sometimes',1),
	(57,73,'Yes',1),
	(58,73,'No',1),
	(59,76,'Yes',1),
	(60,76,'No',1),
	(61,77,'Yes ',1),
	(62,77,'No',1),
	(63,78,'Yes',1),
	(64,78,'No',1),
	(65,79,'Yes ',1),
	(66,79,'No',1),
	(67,80,'1',1),
	(68,80,'2',1),
	(69,80,'3',1),
	(70,80,'4 or more',1),
	(71,81,'Yes',1),
	(72,81,'No',1),
	(73,81,'Sometimes',1),
	(74,82,'Yes',1),
	(75,82,'No',1),
	(76,84,'Yes',1),
	(77,84,'No',1),
	(78,85,'Yes',1),
	(79,85,'No',1);

/*!40000 ALTER TABLE `assessment_question_option` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table audit_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `audit_log`;

CREATE TABLE `audit_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `target_id` int(10) unsigned NOT NULL,
  `type` varchar(30) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `target_id` (`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;

INSERT INTO `audit_log` (`id`, `user_id`, `target_id`, `type`, `created_at`)
VALUES
	(125,1,0,'log-in','2019-07-05 10:01:33'),
	(126,417,0,'log-in','2019-07-05 10:13:26'),
	(127,418,0,'log-in','2019-07-05 11:06:28'),
	(128,1,0,'log-in','2019-07-05 11:07:18'),
	(129,417,0,'log-in','2019-07-05 11:17:03'),
	(130,418,0,'log-in','2019-07-05 11:17:42'),
	(131,418,0,'log-in','2019-07-05 11:20:21'),
	(132,418,0,'log-in','2019-07-05 12:39:49'),
	(133,418,12,'create-programme','2019-07-05 13:00:26'),
	(134,420,0,'log-in','2019-07-05 13:06:30'),
	(135,418,216,'create-player','2019-07-05 13:24:03'),
	(136,421,0,'log-in','2019-07-05 13:24:52'),
	(137,2,0,'log-in','2019-07-07 19:21:42'),
	(138,418,0,'log-in','2019-07-08 09:07:08'),
	(139,420,0,'log-in','2019-07-08 09:09:45'),
	(140,1,0,'log-in','2019-07-08 09:19:55'),
	(141,1,0,'log-in','2019-07-08 09:20:26'),
	(142,418,0,'log-in','2019-07-08 09:44:30'),
	(143,418,0,'log-in','2019-07-08 09:55:08'),
	(144,420,0,'log-in','2019-07-08 10:03:21'),
	(145,418,0,'log-in','2019-07-08 10:30:27'),
	(146,420,0,'log-in','2019-07-08 10:31:02'),
	(147,420,0,'log-in','2019-07-08 10:31:30'),
	(148,421,0,'log-in','2019-07-08 10:57:23'),
	(149,418,0,'log-in','2019-07-08 11:44:42'),
	(150,421,0,'log-in','2019-07-08 11:45:14'),
	(151,418,0,'log-in','2019-07-08 13:22:51'),
	(152,421,0,'log-in','2019-07-08 13:33:34'),
	(153,420,0,'log-in','2019-07-08 13:34:15'),
	(154,421,0,'log-in','2019-07-08 13:45:18'),
	(155,422,0,'log-in','2019-07-08 15:35:15'),
	(156,422,217,'create-player','2019-07-08 15:42:31'),
	(157,421,0,'log-in','2019-07-09 09:18:21'),
	(158,418,0,'log-in','2019-07-09 09:35:37'),
	(159,1,0,'log-in','2019-07-12 11:38:49'),
	(160,1,0,'log-in','2019-07-12 11:39:29'),
	(161,2,0,'log-in','2019-07-12 11:40:45'),
	(162,2,0,'log-in','2019-07-12 11:41:09'),
	(163,418,0,'log-in','2019-07-12 11:43:27'),
	(164,418,0,'log-in','2019-07-12 11:44:23'),
	(165,1,0,'log-in','2019-07-12 13:28:37'),
	(166,418,0,'log-in','2019-07-15 18:00:19'),
	(167,1,0,'log-in','2019-07-16 15:52:05'),
	(168,418,0,'log-in','2019-07-16 16:31:56'),
	(169,418,0,'log-in','2019-07-16 16:38:34'),
	(170,418,0,'log-in','2019-07-17 10:19:12'),
	(171,418,0,'log-in','2019-07-17 10:28:42'),
	(172,418,0,'log-in','2019-07-17 14:39:50'),
	(173,418,0,'log-in','2019-07-17 14:52:12'),
	(174,418,0,'log-in','2019-07-17 14:53:55'),
	(175,418,13,'create-programme','2019-07-17 15:50:26'),
	(176,421,0,'log-in','2019-07-17 16:51:11'),
	(177,418,0,'log-in','2019-07-18 13:05:35'),
	(178,418,0,'log-in','2019-07-18 13:16:15'),
	(179,421,0,'log-in','2019-07-18 13:18:06'),
	(180,418,0,'log-in','2019-07-18 15:48:59'),
	(181,418,0,'log-in','2019-07-18 15:50:24'),
	(182,421,0,'log-in','2019-07-18 16:53:28'),
	(183,2,0,'log-in','2019-07-19 09:44:06'),
	(184,1,0,'log-in','2019-07-19 09:45:18'),
	(185,418,0,'log-in','2019-07-19 09:45:52'),
	(186,423,0,'log-in','2019-07-19 09:49:38'),
	(187,424,0,'log-in','2019-07-19 09:55:13'),
	(188,423,0,'log-in','2019-07-19 09:58:05'),
	(189,418,0,'log-in','2019-07-19 10:12:32'),
	(190,424,16,'create-programme','2019-07-19 10:55:18'),
	(191,424,19,'create-programme','2019-07-19 10:57:40'),
	(192,425,0,'log-in','2019-07-19 11:01:39'),
	(193,426,0,'log-in','2019-07-19 11:29:10'),
	(194,418,0,'log-in','2019-07-19 11:39:34'),
	(195,418,0,'log-in','2019-07-19 11:40:42'),
	(196,426,0,'log-in','2019-07-19 11:51:49'),
	(197,427,0,'log-in','2019-07-19 11:52:39'),
	(198,418,0,'log-in','2019-07-19 11:56:02'),
	(199,418,0,'log-in','2019-07-19 11:56:41'),
	(200,418,0,'log-in','2019-07-19 11:57:37'),
	(201,418,0,'log-in','2019-07-19 12:03:55'),
	(202,418,0,'log-in','2019-07-19 12:07:40'),
	(203,418,0,'log-in','2019-07-19 12:08:12'),
	(204,424,218,'create-player','2019-07-19 12:11:42'),
	(205,418,0,'log-in','2019-07-19 12:14:41'),
	(206,428,0,'log-in','2019-07-19 12:15:11'),
	(207,418,0,'log-in','2019-07-19 12:18:38'),
	(208,418,0,'log-in','2019-07-19 12:23:37'),
	(209,1,0,'log-in','2019-07-19 12:28:26'),
	(210,418,0,'log-in','2019-07-19 12:30:51'),
	(211,424,0,'log-in','2019-07-19 14:10:13'),
	(212,418,0,'log-in','2019-07-19 15:21:27'),
	(213,423,0,'log-in','2019-07-19 15:54:57'),
	(214,424,0,'log-in','2019-07-19 15:55:27'),
	(215,426,0,'log-in','2019-07-19 15:58:18'),
	(216,424,0,'log-in','2019-07-19 15:59:02'),
	(217,428,0,'log-in','2019-07-19 16:06:42'),
	(218,428,219,'create-player','2019-07-19 16:08:38'),
	(219,424,0,'log-in','2019-07-19 16:12:25'),
	(220,423,0,'log-in','2019-07-19 16:17:22'),
	(221,418,0,'log-in','2019-07-19 16:28:55'),
	(222,425,0,'log-in','2019-07-19 16:36:39'),
	(223,428,0,'log-in','2019-07-19 16:41:20'),
	(224,424,0,'log-in','2019-07-19 17:16:20'),
	(225,425,0,'log-in','2019-07-19 17:39:17'),
	(226,425,0,'log-in','2019-07-19 17:40:12'),
	(227,425,0,'log-in','2019-07-19 17:41:27'),
	(228,425,0,'log-in','2019-07-22 09:09:19'),
	(229,428,0,'log-in','2019-07-22 10:10:40'),
	(230,425,0,'log-in','2019-07-22 10:14:30'),
	(231,425,0,'log-in','2019-07-22 10:25:47'),
	(232,425,0,'log-in','2019-07-22 10:30:44'),
	(233,425,0,'log-in','2019-07-22 10:31:45'),
	(234,425,0,'log-in','2019-07-22 10:37:02'),
	(235,425,0,'log-in','2019-07-22 10:38:23'),
	(236,425,20,'create-programme','2019-07-22 10:40:54'),
	(237,425,0,'log-in','2019-07-22 12:05:27'),
	(238,428,0,'log-in','2019-07-22 12:06:37'),
	(239,428,0,'log-in','2019-07-22 12:38:16'),
	(240,428,0,'log-in','2019-07-22 13:17:14'),
	(241,425,0,'log-in','2019-07-22 13:19:01'),
	(242,425,21,'create-programme','2019-07-22 13:20:47'),
	(243,425,22,'create-programme','2019-07-22 13:23:04'),
	(244,425,0,'log-in','2019-07-22 13:42:24'),
	(245,425,0,'log-in','2019-07-22 14:44:33'),
	(246,425,0,'log-in','2019-07-22 14:48:40'),
	(247,425,0,'log-in','2019-07-22 15:24:58'),
	(248,418,0,'log-in','2019-07-22 15:35:58'),
	(249,420,0,'log-in','2019-07-22 15:42:38'),
	(250,425,0,'log-in','2019-07-22 16:11:37'),
	(251,418,0,'log-in','2019-07-22 16:12:53'),
	(252,425,0,'log-in','2019-07-22 16:37:32'),
	(253,1,0,'log-in','2019-07-25 04:27:23'),
	(254,424,0,'log-in','2019-07-31 14:05:44'),
	(255,424,0,'log-in','2019-07-31 14:11:48'),
	(256,2,0,'log-in','2019-07-31 14:12:18'),
	(257,2,0,'log-in','2019-07-31 14:13:23'),
	(258,430,0,'log-in','2019-07-31 17:29:10'),
	(259,433,0,'log-in','2019-07-31 17:37:44'),
	(260,2,0,'log-in','2019-07-31 17:47:58'),
	(261,1,0,'log-in','2019-07-31 17:48:07'),
	(262,1,0,'log-in','2019-07-31 17:48:38'),
	(263,1,0,'log-in','2019-07-31 17:51:12'),
	(264,433,0,'log-in','2019-07-31 17:58:47'),
	(265,2,0,'log-in','2019-07-31 18:05:56'),
	(266,418,0,'log-in','2019-07-31 18:20:37'),
	(267,418,0,'log-in','2019-07-31 18:26:33'),
	(268,2,0,'log-in','2019-07-31 18:54:54'),
	(269,2,0,'log-in','2019-07-31 18:59:55'),
	(270,1,0,'log-in','2019-08-03 11:00:48'),
	(271,418,0,'log-in','2019-08-03 11:04:12'),
	(272,417,0,'log-in','2019-08-04 15:07:34'),
	(273,418,0,'log-in','2019-08-04 15:08:35'),
	(274,1,0,'log-in','2019-08-10 02:39:46'),
	(275,2,0,'log-in','2019-08-10 02:50:05'),
	(276,418,0,'log-in','2019-08-10 02:51:44'),
	(277,417,0,'log-in','2019-08-14 09:53:32'),
	(278,418,0,'log-in','2019-08-14 09:59:00'),
	(279,417,0,'log-in','2019-08-14 10:10:57'),
	(280,418,0,'log-in','2019-08-14 10:37:00'),
	(281,417,0,'log-in','2019-08-14 10:37:24'),
	(282,418,0,'log-in','2019-08-14 10:39:29'),
	(283,418,0,'log-in','2019-08-14 10:50:51'),
	(284,418,23,'create-programme','2019-08-14 11:48:05'),
	(285,421,0,'log-in','2019-08-14 12:03:40'),
	(286,421,0,'log-in','2019-08-14 12:31:10'),
	(287,418,0,'log-in','2019-08-14 12:58:50'),
	(288,418,0,'log-in','2019-08-19 09:24:04'),
	(289,418,24,'create-programme','2019-08-19 09:42:12'),
	(290,421,0,'log-in','2019-08-19 09:43:31'),
	(291,418,25,'create-programme','2019-08-19 12:08:30'),
	(292,418,26,'create-programme','2019-08-19 12:12:56'),
	(293,418,27,'create-programme','2019-08-19 12:14:08'),
	(294,418,28,'create-programme','2019-08-19 12:16:35'),
	(295,418,0,'log-in','2019-08-20 09:28:08'),
	(296,418,0,'log-in','2019-08-20 09:56:54'),
	(297,418,0,'log-in','2019-08-20 11:30:06'),
	(298,418,29,'create-programme','2019-08-20 15:22:16'),
	(299,418,0,'log-in','2019-08-20 15:27:49'),
	(300,418,0,'log-in','2019-08-21 11:33:11'),
	(301,418,0,'log-in','2019-08-21 11:48:11'),
	(302,418,0,'log-in','2019-08-22 09:47:32'),
	(303,1,0,'log-in','2019-08-22 09:48:16'),
	(304,417,0,'log-in','2019-08-22 09:54:23'),
	(305,1,0,'log-in','2019-08-22 10:29:46'),
	(306,438,0,'log-in','2019-08-22 10:35:41'),
	(307,439,0,'log-in','2019-08-22 10:40:06'),
	(308,440,0,'log-in','2019-08-22 10:43:00'),
	(309,439,0,'log-in','2019-08-22 10:43:37'),
	(310,441,0,'log-in','2019-08-22 10:47:44'),
	(311,1,0,'log-in','2019-08-22 10:50:16'),
	(312,439,0,'log-in','2019-08-22 10:59:08'),
	(313,1,0,'log-in','2019-08-22 11:05:25'),
	(314,439,0,'log-in','2019-08-22 11:06:06'),
	(315,1,0,'log-in','2019-08-22 11:12:35'),
	(316,418,0,'log-in','2019-08-22 12:21:16'),
	(317,439,0,'log-in','2019-08-22 12:23:37'),
	(318,418,0,'log-in','2019-08-22 12:29:26'),
	(319,441,0,'log-in','2019-08-22 12:30:13'),
	(320,418,0,'log-in','2019-08-22 12:35:41'),
	(321,429,0,'log-in','2019-08-22 12:36:15'),
	(322,1,0,'log-in','2019-08-22 12:57:56'),
	(323,439,0,'log-in','2019-08-22 13:12:24'),
	(324,438,0,'log-in','2019-08-22 13:14:32'),
	(325,418,0,'log-in','2019-08-22 13:18:03'),
	(326,418,0,'log-in','2019-08-22 13:19:00'),
	(327,417,0,'log-in','2019-08-22 13:39:42'),
	(328,418,0,'log-in','2019-08-22 14:14:56'),
	(329,438,0,'log-in','2019-08-22 14:20:11'),
	(330,441,0,'log-in','2019-08-22 14:20:50'),
	(331,439,0,'log-in','2019-08-22 14:21:07'),
	(332,441,0,'log-in','2019-08-22 14:24:08'),
	(333,438,0,'log-in','2019-08-22 14:50:45'),
	(334,1,0,'log-in','2019-08-22 14:53:24'),
	(335,418,0,'log-in','2019-08-22 14:54:13'),
	(336,429,0,'log-in','2019-08-22 15:06:13'),
	(337,418,0,'log-in','2019-08-22 15:07:13'),
	(338,421,0,'log-in','2019-08-22 15:07:38'),
	(339,417,0,'log-in','2019-08-22 15:16:31'),
	(340,418,0,'log-in','2019-08-22 15:19:36'),
	(341,429,0,'log-in','2019-08-22 15:19:59'),
	(342,1,0,'log-in','2019-08-22 15:21:01'),
	(343,418,0,'log-in','2019-08-22 15:29:35'),
	(344,439,0,'log-in','2019-08-22 15:33:56'),
	(345,421,0,'log-in','2019-08-22 16:25:37'),
	(346,422,0,'log-in','2019-08-22 17:13:41'),
	(347,418,0,'log-in','2019-08-22 17:29:22'),
	(348,417,0,'log-in','2019-08-22 17:32:10'),
	(349,1,0,'log-in','2019-08-22 17:33:48'),
	(350,438,0,'log-in','2019-08-23 09:52:32'),
	(351,417,0,'log-in','2019-08-23 10:04:13'),
	(352,418,0,'log-in','2019-08-23 10:04:29'),
	(353,422,0,'log-in','2019-08-23 10:05:03'),
	(354,429,0,'log-in','2019-08-23 10:05:37'),
	(355,438,0,'log-in','2019-08-23 10:45:47'),
	(356,438,0,'log-in','2019-08-23 10:52:10'),
	(357,418,0,'log-in','2019-08-23 10:55:29'),
	(358,442,0,'log-in','2019-08-23 11:17:38'),
	(359,438,0,'log-in','2019-08-23 11:27:17'),
	(360,418,0,'log-in','2019-08-23 11:27:42'),
	(361,421,0,'log-in','2019-08-23 12:51:57'),
	(362,417,0,'log-in','2019-08-23 13:13:48'),
	(363,418,0,'log-in','2019-08-23 13:15:44'),
	(364,418,0,'log-in','2019-08-23 13:29:57'),
	(365,418,0,'log-in','2019-08-23 13:30:37'),
	(366,417,0,'log-in','2019-08-23 13:31:08'),
	(367,418,0,'log-in','2019-08-23 13:44:44'),
	(368,438,0,'log-in','2019-08-23 15:43:18'),
	(369,418,0,'log-in','2019-08-23 15:48:19'),
	(370,438,0,'log-in','2019-08-23 15:48:51'),
	(371,438,0,'log-in','2019-08-23 15:49:15'),
	(372,438,0,'log-in','2019-08-23 15:50:23'),
	(373,418,0,'log-in','2019-08-23 15:55:15'),
	(374,418,0,'log-in','2019-08-23 15:55:56'),
	(375,438,0,'log-in','2019-08-23 15:59:05'),
	(376,418,0,'log-in','2019-08-23 16:07:58'),
	(377,418,0,'log-in','2019-08-23 16:16:13'),
	(378,418,0,'log-in','2019-08-23 16:20:08'),
	(379,418,0,'log-in','2019-08-23 16:30:28'),
	(380,418,0,'log-in','2019-08-23 16:31:35'),
	(381,418,0,'log-in','2019-08-23 16:44:36'),
	(382,417,0,'log-in','2019-08-26 20:47:39'),
	(383,438,0,'log-in','2019-08-27 09:05:04'),
	(384,418,0,'log-in','2019-08-27 09:05:21'),
	(385,418,0,'log-in','2019-08-27 09:27:55'),
	(386,418,0,'log-in','2019-08-27 10:36:41'),
	(387,422,0,'log-in','2019-08-27 11:49:19'),
	(388,418,0,'log-in','2019-08-27 11:50:52'),
	(389,418,224,'create-player','2019-08-27 12:19:04'),
	(390,418,225,'create-player','2019-08-27 15:25:29'),
	(391,418,30,'create-programme','2019-08-27 15:27:13'),
	(392,422,0,'log-in','2019-08-27 15:51:26'),
	(393,418,0,'log-in','2019-08-27 15:59:44'),
	(394,418,0,'log-in','2019-08-27 16:00:13'),
	(395,418,0,'log-in','2019-08-27 16:07:00'),
	(396,418,0,'log-in','2019-08-28 14:05:51'),
	(397,438,0,'log-in','2019-08-28 15:31:32'),
	(398,418,0,'log-in','2019-08-28 15:34:16'),
	(399,418,0,'log-in','2019-08-28 16:31:53'),
	(400,418,0,'log-in','2019-08-28 16:45:19'),
	(401,418,0,'log-in','2019-08-28 16:56:33'),
	(402,418,0,'log-in','2019-08-28 17:00:47'),
	(403,439,0,'log-in','2019-08-28 17:19:05'),
	(404,418,0,'log-in','2019-08-28 17:34:30'),
	(405,418,0,'log-in','2019-08-28 17:37:13'),
	(406,2,0,'log-in','2019-08-28 17:50:08'),
	(407,1,0,'log-in','2019-08-29 09:07:15'),
	(408,438,0,'log-in','2019-08-29 09:07:54'),
	(409,438,0,'log-in','2019-08-29 09:08:07'),
	(410,438,0,'log-in','2019-08-29 09:08:25'),
	(411,418,0,'log-in','2019-08-29 09:10:37'),
	(412,1,0,'log-in','2019-08-29 09:12:13'),
	(413,1,0,'log-in','2019-08-29 09:12:41'),
	(414,1,0,'log-in','2019-08-29 09:17:23'),
	(415,1,0,'log-in','2019-08-29 09:18:32'),
	(416,417,0,'log-in','2019-08-29 09:20:39'),
	(417,1,0,'log-in','2019-08-29 09:24:31'),
	(418,418,0,'log-in','2019-08-29 09:24:59'),
	(419,417,0,'log-in','2019-08-29 09:50:55'),
	(420,418,0,'log-in','2019-08-29 09:53:11'),
	(421,1,0,'log-in','2019-08-29 09:57:52'),
	(422,1,0,'log-in','2019-08-29 09:59:29'),
	(423,418,0,'log-in','2019-08-29 10:01:56'),
	(424,418,0,'log-in','2019-08-29 10:04:04'),
	(425,418,0,'log-in','2019-08-29 10:04:57'),
	(426,417,0,'log-in','2019-08-29 10:05:24'),
	(427,417,0,'log-in','2019-08-29 10:06:00'),
	(428,418,0,'log-in','2019-08-29 10:13:42'),
	(429,417,0,'log-in','2019-08-29 10:15:39'),
	(430,418,0,'log-in','2019-08-29 10:16:46'),
	(431,418,0,'log-in','2019-08-29 11:29:02'),
	(432,417,0,'log-in','2019-08-29 11:30:22'),
	(433,418,0,'log-in','2019-08-29 11:31:54'),
	(434,417,0,'log-in','2019-08-29 12:27:24'),
	(435,418,0,'log-in','2019-08-29 12:28:19'),
	(436,417,0,'log-in','2019-08-29 13:00:51'),
	(437,418,0,'log-in','2019-08-29 13:02:41'),
	(438,422,0,'log-in','2019-08-29 13:31:38'),
	(439,418,0,'log-in','2019-08-29 13:34:20'),
	(440,422,0,'log-in','2019-08-29 14:22:37'),
	(441,422,0,'log-in','2019-08-29 15:22:34'),
	(442,418,0,'log-in','2019-08-29 15:28:01'),
	(443,422,0,'log-in','2019-08-29 15:34:21'),
	(444,418,0,'log-in','2019-08-29 15:35:20');

/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table availability
# ------------------------------------------------------------

DROP TABLE IF EXISTS `availability`;

CREATE TABLE `availability` (
  `availability_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`availability_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table availability_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `availability_type`;

CREATE TABLE `availability_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `availability_type` WRITE;
/*!40000 ALTER TABLE `availability_type` DISABLE KEYS */;

INSERT INTO `availability_type` (`type_id`, `title`, `created_at`, `created_by`, `updated_at`, `updated_by`)
VALUES
	(1,'Sick','2017-06-20 12:48:50',2,'2017-06-20 12:48:50',2),
	(2,'Holiday','2017-06-20 12:48:57',2,'2017-06-20 12:48:57',2),
	(3,'Other','2017-06-20 12:49:02',2,'2017-06-20 12:49:02',2);

/*!40000 ALTER TABLE `availability_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table award
# ------------------------------------------------------------

DROP TABLE IF EXISTS `award`;

CREATE TABLE `award` (
  `award_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `type_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`award_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table award_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `award_type`;

CREATE TABLE `award_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`type_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table checklist
# ------------------------------------------------------------

DROP TABLE IF EXISTS `checklist`;

CREATE TABLE `checklist` (
  `checklist_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `completed_by` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`checklist_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table checklist_item
# ------------------------------------------------------------

DROP TABLE IF EXISTS `checklist_item`;

CREATE TABLE `checklist_item` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `checklist_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `checklist_id` (`checklist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table club
# ------------------------------------------------------------

DROP TABLE IF EXISTS `club`;

CREATE TABLE `club` (
  `club_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `type` enum('academy','both','fc') DEFAULT NULL,
  `logo_url` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(30) NOT NULL,
  `emergency_telephone` varchar(30) NOT NULL,
  `website` varchar(255) NOT NULL,
  `facebook_url` text,
  `twitter_url` text,
  `youtube_url` text,
  `instagram_url` text,
  `address` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `town` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postcode` varchar(30) DEFAULT NULL,
  `fc_company` varchar(255) DEFAULT NULL,
  `ss_company` varchar(255) DEFAULT NULL,
  `fa_affiliation` varchar(20) DEFAULT NULL,
  `company_number` varchar(255) NOT NULL,
  `vat_number` varchar(255) NOT NULL,
  `vat_rate` int(3) DEFAULT NULL,
  `threshold` int(11) DEFAULT NULL,
  `threshold_date` timestamp NULL DEFAULT NULL,
  `fc_account_created` tinyint(1) NOT NULL,
  `ss_account_created` tinyint(1) NOT NULL,
  `size_chart` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`club_id`),
  KEY `franchise_id` (`franchise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;

INSERT INTO `club` (`club_id`, `franchise_id`, `title`, `slug`, `type`, `logo_url`, `email`, `telephone`, `emergency_telephone`, `website`, `facebook_url`, `twitter_url`, `youtube_url`, `instagram_url`, `address`, `address2`, `town`, `city`, `postcode`, `fc_company`, `ss_company`, `fa_affiliation`, `company_number`, `vat_number`, `vat_rate`, `threshold`, `threshold_date`, `fc_account_created`, `ss_account_created`, `size_chart`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(105,145,'arsenal','arsenal','both','http://api2.grassroots.hostings.co.uk/storage/clubs/105/1562320559_arsenal.png','info@arsenal.co.uk','01622296755','','https://www.visitbritain.com',NULL,NULL,NULL,NULL,'The Football Association','Highbury House, 75 Drayton Park','London',NULL,'N5 1BU','Arsenal Football Club','Arsenal academy ','100','1000','',0,20,NULL,1,1,'http://api2.grassroots.hostings.co.uk/storage/kit-size/105/1563291593_Document1.pdf','2019-07-05 10:55:59',0,'2019-08-23 11:02:57',418,1),
	(106,145,'bercelona','bercelona','both','http://api2.grassroots.hostings.co.uk/storage/clubs/106/1562321061_download.png','bercelona@net.co.uk','34 902 18 99 00','','https://www.fcbarcelona.com',NULL,NULL,NULL,NULL,'C. d\'Arístides Maillol','12, 08028 Barcelona','London',NULL,'IG11 9ap','FC Barcelona Club','FC Barcelona Academy','1000','100','',0,0,NULL,0,0,NULL,'2019-07-05 11:04:21',0,'2019-07-05 11:04:21',0,1),
	(107,146,'spurs','spurs','both','http://api2.grassroots.hostings.co.uk/storage/clubs/107/1563526472_spurs.png','poch@xanda.net','02085555555','','www.spurs.co.uk','facebook.com','twitter.com','youtube.com','instagram.com','100 Tottenham High Road, Tottenham','Tottenham','London',NULL,'N20 123','Spurs FC','Tottenham Soccer School','987654321','Tottenham Hotspur','12345678',20,0,NULL,0,0,'http://api2.grassroots.hostings.co.uk/storage/kit-size/107/1563528735_Document1.pdf','2019-07-19 09:54:32',0,'2019-07-19 10:35:49',424,1),
	(108,147,'Shistos','shistos','academy','','icecube@icecube.com','555123344','','www.icecube.com',NULL,NULL,NULL,NULL,'123','Old Kent Rd','London',NULL,'N14 5HG',NULL,'Shessies',NULL,'','',0,0,NULL,0,1,NULL,'2019-07-31 17:34:46',0,'2019-07-31 17:52:37',430,1),
	(109,4,'france','france','academy','','france@france.com','3333','','france.com',NULL,NULL,NULL,NULL,'3333','3333','3333333',NULL,'333',NULL,'france',NULL,'33333','',0,0,NULL,0,0,NULL,'2019-07-31 18:07:39',0,'2019-07-31 18:07:39',0,1),
	(110,4,'francefrance','francefrance','academy','','france@france.com','3333','','france.com',NULL,NULL,NULL,NULL,'3333','3333','3333333',NULL,'333',NULL,'france',NULL,'33333','',0,0,NULL,0,0,NULL,'2019-07-31 18:08:36',0,'2019-07-31 18:08:36',0,1),
	(111,145,'testing2','testing2','fc','http://api2.grassroots.hostings.co.uk/storage/clubs/111/1565772929_download.png','kamrul@xanda.net','29019283','','asdf',NULL,NULL,NULL,NULL,'Whitechaple','Vicarage rode','London',NULL,'me15 6eh','PIngala',NULL,'aff','','',0,0,NULL,0,0,NULL,'2019-08-14 09:55:29',0,'2019-08-14 09:55:29',0,1),
	(112,149,'leeds','leeds','fc','http://api2.grassroots.hostings.co.uk/storage/clubs/112/1566466733_leeds_badge.jpg','daryan@xanda.net','07481822797','','',NULL,NULL,NULL,NULL,'North london',NULL,'London',NULL,'n2 n93','sd','Xanda','f','Xanda','',0,0,NULL,1,1,NULL,'2019-08-22 10:38:53',0,'2019-08-22 16:45:03',439,1),
	(113,150,'test','test',NULL,'','test','test','','tets',NULL,NULL,NULL,NULL,'test','test','test',NULL,'test',NULL,NULL,NULL,'','',0,0,NULL,0,0,NULL,'2019-08-23 11:25:25',0,'2019-08-23 11:25:25',0,1),
	(114,149,'asd','asd','both','http://api2.grassroots.hostings.co.uk/storage/clubs/114/1566571475_leeds_badge.jpg','asd@asd.com','123456789','','asd',NULL,NULL,NULL,NULL,'asd','asd','asd',NULL,'asd','asd','qwe`qw','asd','asd','',0,0,NULL,0,0,NULL,'2019-08-23 15:44:35',0,'2019-08-23 15:44:35',0,1),
	(115,149,'test1','test1',NULL,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',0,0,NULL,0,0,NULL,'2019-08-23 15:49:49',0,'2019-08-23 15:49:49',0,1),
	(116,149,'test2','test2',NULL,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',0,0,NULL,0,0,NULL,'2019-08-23 15:50:36',0,'2019-08-23 15:50:36',0,1),
	(117,149,'test3','test3',NULL,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',0,0,NULL,0,0,NULL,'2019-08-23 15:51:30',0,'2019-08-23 15:51:30',0,1),
	(118,149,'aaaa','aaaa',NULL,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',0,0,NULL,0,0,NULL,'2019-08-23 16:02:14',0,'2019-08-23 16:02:14',0,1),
	(119,149,'testing123','testing123',NULL,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','',0,0,NULL,0,0,NULL,'2019-08-23 16:06:18',0,'2019-08-23 16:06:18',0,1);

/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table coach_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `coach_info`;

CREATE TABLE `coach_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `fan_number` varchar(255) DEFAULT NULL,
  `utr_number` varchar(100) DEFAULT NULL,
  `rate` decimal(8,2) DEFAULT NULL,
  `rate2` decimal(8,2) DEFAULT NULL,
  `rate3` decimal(8,2) DEFAULT NULL,
  `show_money_owned` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `coach_info` WRITE;
/*!40000 ALTER TABLE `coach_info` DISABLE KEYS */;

INSERT INTO `coach_info` (`id`, `user_id`, `fan_number`, `utr_number`, `rate`, `rate2`, `rate3`, `show_money_owned`)
VALUES
	(23,420,'10000','10000',20.00,NULL,NULL,0),
	(24,426,'12345667','12134557',10.00,NULL,NULL,0),
	(25,427,NULL,NULL,21.00,NULL,NULL,0),
	(26,429,'10000','12346',11.00,NULL,NULL,0),
	(27,437,'120','12',15.00,NULL,NULL,0),
	(28,441,'123','123',20.00,NULL,NULL,0);

/*!40000 ALTER TABLE `coach_info` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table consent
# ------------------------------------------------------------

DROP TABLE IF EXISTS `consent`;

CREATE TABLE `consent` (
  `consent_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`consent_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `consent` WRITE;
/*!40000 ALTER TABLE `consent` DISABLE KEYS */;

INSERT INTO `consent` (`consent_id`, `franchise_id`, `club_id`, `title`, `content`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(1,146,107,'Trainginh Consent','I consent to my kids doing tackles. ','2019-07-19 11:48:36',424,'2019-07-19 11:48:36',424,1),
	(2,146,107,'Travel Consent','Do you consent?','2019-07-19 16:05:12',424,'2019-07-19 16:05:12',424,1),
	(3,146,107,'Test Consent','Consent content','2019-07-22 09:12:05',425,'2019-07-22 09:12:05',425,1),
	(4,145,105,'Test 1','Consent content','2019-07-22 15:36:12',418,'2019-07-22 15:36:12',418,1);

/*!40000 ALTER TABLE `consent` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table download
# ------------------------------------------------------------

DROP TABLE IF EXISTS `download`;

CREATE TABLE `download` (
  `download_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `visibility` varchar(20) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `image_url` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `order` int(11) DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`download_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `download` WRITE;
/*!40000 ALTER TABLE `download` DISABLE KEYS */;

INSERT INTO `download` (`download_id`, `franchise_id`, `club_id`, `category_id`, `visibility`, `title`, `content`, `image_url`, `file_url`, `created_at`, `created_by`, `updated_at`, `updated_by`, `order`, `status`)
VALUES
	(14,145,105,1,'guardian','Siler','asdf','','http://api2.grassroots.hostings.co.uk/storage/downloads/418/1562583854_sample.pdf','2019-07-08 12:04:14',418,'2019-07-08 12:04:14',0,NULL,1),
	(15,145,105,2,'all','How to play football','How to play football. 2','','http://api2.grassroots.hostings.co.uk/storage/downloads/418/1567079626_sample.pdf','2019-07-08 15:36:36',418,'2019-08-29 12:53:46',418,NULL,1),
	(16,145,105,14,'all','Manual','has some important info in it','','http://api2.grassroots.hostings.co.uk/storage/downloads/418/1563355250_Document1.pdf','2019-07-17 10:20:50',418,'2019-07-17 10:20:50',0,NULL,1),
	(17,145,105,12,'coach','123','afsdf123','','http://api2.grassroots.hostings.co.uk/storage/downloads/418/1566993503_leeds_badge.jpg','2019-07-17 11:01:52',418,'2019-08-28 12:58:23',418,NULL,1),
	(18,146,107,15,'coach','Plan 1','This is the first session plan','','http://api2.grassroots.hostings.co.uk/storage/downloads/424/1563533368_Document1.pdf','2019-07-19 11:49:28',424,'2019-07-19 11:49:28',0,NULL,1);

/*!40000 ALTER TABLE `download` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table download_category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `download_category`;

CREATE TABLE `download_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `download_category` WRITE;
/*!40000 ALTER TABLE `download_category` DISABLE KEYS */;

INSERT INTO `download_category` (`id`, `club_id`, `title`, `created_at`, `created_by`, `updated_at`, `updated_by`)
VALUES
	(1,NULL,'Category 1','2017-06-20 12:48:50',2,'2018-09-14 16:53:55',2),
	(2,NULL,'Category 2','2017-06-20 12:48:57',2,'2018-09-14 16:54:01',2),
	(3,NULL,'Category 3','2017-06-20 12:49:02',2,'2018-09-14 16:54:04',2),
	(10,105,'Category 1','2019-07-16 18:05:05',418,'2019-07-16 18:05:05',418),
	(11,105,'Category 2','2019-07-16 18:05:15',418,'2019-07-16 18:05:15',418),
	(12,105,'asdf','2019-07-17 09:03:25',418,'2019-07-17 09:03:25',418),
	(13,105,'Test 1','2019-07-17 09:11:08',418,'2019-07-17 09:11:08',418),
	(14,105,'Manuals','2019-07-17 10:20:08',418,'2019-07-17 10:20:08',418),
	(15,107,'Session Plans','2019-07-19 11:49:07',424,'2019-07-19 11:49:07',424);

/*!40000 ALTER TABLE `download_category` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table event_requests
# ------------------------------------------------------------

DROP TABLE IF EXISTS `event_requests`;

CREATE TABLE `event_requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) NOT NULL DEFAULT '0',
  `type_id` int(11) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp NULL DEFAULT NULL,
  `max_size` int(4) DEFAULT '0',
  `is_coach_required` tinyint(4) DEFAULT '0',
  `coach_id` int(11) DEFAULT NULL,
  `venue` int(11) DEFAULT NULL,
  `notes` text,
  `status` tinyint(4) DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `franchise_id` (`club_id`),
  KEY `type_id` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `event_requests` WRITE;
/*!40000 ALTER TABLE `event_requests` DISABLE KEYS */;

INSERT INTO `event_requests` (`request_id`, `club_id`, `type_id`, `start_time`, `end_time`, `max_size`, `is_coach_required`, `coach_id`, `venue`, `notes`, `status`, `created_by`, `created_at`, `updated_by`, `updated_at`)
VALUES
	(1,105,1,'2019-07-18 17:30:00','2019-07-18 19:30:00',1,1,420,9155,'I change my mind asdf xvcsdafsd',1,421,'2019-07-17 17:04:10',421,'2019-07-18 16:43:23'),
	(2,105,7,'2019-08-31 19:40:00','2019-08-31 21:30:00',12,1,429,9155,'Charity event for everyone.',1,421,'2019-07-18 16:50:46',418,'2019-08-29 12:49:33'),
	(3,105,7,'2019-07-26 17:30:00','2019-07-26 19:30:00',10,1,420,9155,'Charity event test',1,421,'2019-07-18 16:58:12',418,'2019-07-19 11:59:53'),
	(4,107,1,'2019-07-27 17:20:00','2019-07-27 18:20:00',10,1,426,9161,'Please bring the ball',1,428,'2019-07-19 12:24:44',424,'2019-07-19 12:25:13');

/*!40000 ALTER TABLE `event_requests` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table faq
# ------------------------------------------------------------

DROP TABLE IF EXISTS `faq`;

CREATE TABLE `faq` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `faq_section` text,
  `file_path` text,
  `file_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;

INSERT INTO `faq` (`id`, `question`, `answer`, `type`, `faq_section`, `file_path`, `file_type`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(1,'test','<p>test</p>\r\n','clubadmin','caAccount','','','2019-07-31 17:58:09',1,'2019-07-31 17:58:09',1,1),
	(2,'test 2','<p></p>\r\n','clubadmin','caAccount','','','2019-07-31 17:58:21',1,'2019-07-31 17:58:21',1,1),
	(3,'Why is a transaction fee charge?','<p>We use Gocardless to carry out all the transaction for us and jfjkashdfjhas;kldhgkjasdhgkl;sahdg</p>\r\n<p>sdgsadgasgasgassgdasdgas<span style=\"color: rgb(226,80,65);\">dgsdagsgsdgsadgsadg</span>. dwfsssgsgsg.</p>\r\n<p>&nbsp;</p>\r\n','clubadmin','caAccount','','','2019-08-10 02:48:30',1,'2019-08-10 02:48:30',1,1),
	(4,'Stelios Testing 1','<p>dfsagasfgdsfg</p>\r\n<p>sdgsagsadg</p>\r\n<p>sadgasdgasdg</p>\r\n<p></p>\r\n<iframe width=\"auto\" height=\"auto\" src=\"dgsadgsdag\" frameBorder=\"0\"></iframe>\r\n<p></p>\r\n','superadmin','saPurchasedPackage','','','2019-08-10 02:49:30',1,'2019-08-10 02:49:30',1,1);

/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table fee
# ------------------------------------------------------------

DROP TABLE IF EXISTS `fee`;

CREATE TABLE `fee` (
  `fee_id` int(11) NOT NULL,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `agegroup_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `fee` decimal(8,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`fee_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`),
  KEY `agegroup_id` (`agegroup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table feedback
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feedback`;

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `type` enum('homework','feedback') NOT NULL DEFAULT 'feedback',
  PRIMARY KEY (`feedback_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `team_id` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;

INSERT INTO `feedback` (`feedback_id`, `franchise_id`, `team_id`, `title`, `content`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`, `type`)
VALUES
	(138,145,0,'Do you like the coaches?','','2019-07-08 11:53:23',418,'2019-07-08 11:53:23',0,1,'feedback'),
	(139,145,0,'Feedback test','','2019-07-08 13:39:56',418,'2019-07-08 13:39:56',0,1,'feedback'),
	(140,145,0,'Affordable ','','2019-07-08 13:47:01',418,'2019-07-08 13:47:01',0,1,'feedback'),
	(141,145,0,'Feedback test 2','','2019-07-09 11:26:37',418,'2019-07-09 11:26:37',0,1,'feedback'),
	(142,146,0,'How are we doing?','','2019-07-19 11:51:39',424,'2019-07-19 11:51:39',0,1,'feedback');

/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table feedback_answer
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feedback_answer`;

CREATE TABLE `feedback_answer` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`answer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `feedback_answer` WRITE;
/*!40000 ALTER TABLE `feedback_answer` DISABLE KEYS */;

INSERT INTO `feedback_answer` (`answer_id`, `content`, `created_at`, `created_by`)
VALUES
	(102,'Yes','2019-07-08 11:55:20',421),
	(103,'No','2019-07-08 11:55:20',421),
	(104,'You are all really great. Thank you!','2019-07-08 11:55:20',421),
	(105,'Yes','2019-07-08 13:47:32',421),
	(106,'Some text','2019-07-08 13:47:32',421),
	(107,'Yes','2019-07-08 15:46:58',422),
	(108,'ljkjjjjjjjjjjjjjjjjjjj','2019-07-08 15:46:58',422),
	(109,'asdf','2019-07-09 13:00:53',421),
	(110,'Yes','2019-07-09 13:00:54',421),
	(111,'Yes','2019-07-19 11:52:10',426),
	(112,'Pay coaches a little more please','2019-07-19 11:52:10',426),
	(113,'Np','2019-07-19 11:53:04',427),
	(114,'Clean our boots after games. ','2019-07-19 11:53:04',427);

/*!40000 ALTER TABLE `feedback_answer` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table feedback_question
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feedback_question`;

CREATE TABLE `feedback_question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `feedback_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `is_multiple_answers` tinyint(4) NOT NULL DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`question_id`),
  KEY `franchise_id` (`franchise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `feedback_question` WRITE;
/*!40000 ALTER TABLE `feedback_question` DISABLE KEYS */;

INSERT INTO `feedback_question` (`question_id`, `franchise_id`, `feedback_id`, `title`, `is_multiple_answers`, `image_url`, `created_at`, `created_by`, `updated_at`, `updated_by`, `order`, `status`)
VALUES
	(215,145,138,'Do you like your team coach?',1,NULL,'2019-07-08 11:53:23',418,'2019-07-08 11:53:23',0,1,1),
	(216,145,138,'Do you liek the kit?',1,NULL,'2019-07-08 11:53:23',418,'2019-07-08 11:53:23',0,1,1),
	(217,145,138,'Any comments?',0,NULL,'2019-07-08 11:53:23',418,'2019-07-08 11:53:23',0,1,1),
	(218,145,139,'Question 1',1,NULL,'2019-07-08 13:39:56',418,'2019-07-08 13:39:56',0,1,1),
	(219,145,139,'Question 2',0,NULL,'2019-07-08 13:39:56',418,'2019-07-08 13:39:56',0,1,1),
	(220,145,140,'Is is affordable',1,NULL,'2019-07-08 13:47:01',418,'2019-07-08 13:47:01',0,1,1),
	(221,145,140,'Your answer',0,NULL,'2019-07-08 13:47:01',418,'2019-07-08 13:47:01',0,1,1),
	(222,145,141,'Question 1',0,NULL,'2019-07-09 11:26:37',418,'2019-07-09 11:26:37',0,1,1),
	(223,145,141,'Question 2',1,NULL,'2019-07-09 11:26:37',418,'2019-07-09 11:26:37',0,1,1),
	(224,146,142,'Are you happy with your coaches?',1,NULL,'2019-07-19 11:51:39',424,'2019-07-19 11:51:39',0,1,1),
	(225,146,142,'What can we do better?',0,NULL,'2019-07-19 11:51:39',424,'2019-07-19 11:51:39',0,1,1);

/*!40000 ALTER TABLE `feedback_question` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table feedback_question_option
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feedback_question_option`;

CREATE TABLE `feedback_question_option` (
  `option_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`option_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `feedback_question_option` WRITE;
/*!40000 ALTER TABLE `feedback_question_option` DISABLE KEYS */;

INSERT INTO `feedback_question_option` (`option_id`, `question_id`, `title`, `order`)
VALUES
	(191,215,'Yes',1),
	(192,215,'No',1),
	(193,216,'Yes',1),
	(194,216,'No',1),
	(195,218,'Yes',1),
	(196,218,'NO',1),
	(197,220,'Yes',1),
	(198,220,'No',1),
	(199,223,'Yes',1),
	(200,223,'No',1),
	(201,224,'Yes',1),
	(202,224,'Np',1);

/*!40000 ALTER TABLE `feedback_question_option` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table franchise
# ------------------------------------------------------------

DROP TABLE IF EXISTS `franchise`;

CREATE TABLE `franchise` (
  `franchise_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `content` text,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(30) NOT NULL,
  `manager_name` varchar(120) DEFAULT NULL,
  `mobile` varchar(40) DEFAULT NULL,
  `emergency_telephone` varchar(30) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `town` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postcode` varchar(30) NOT NULL,
  `organisation_name` varchar(255) DEFAULT NULL,
  `company_number` varchar(255) DEFAULT NULL,
  `vat_number` varchar(255) DEFAULT NULL,
  `fa_affiliation` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `contact_with_email` tinyint(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`franchise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `franchise` WRITE;
/*!40000 ALTER TABLE `franchise` DISABLE KEYS */;

INSERT INTO `franchise` (`franchise_id`, `title`, `image_url`, `content`, `email`, `telephone`, `manager_name`, `mobile`, `emergency_telephone`, `website`, `address`, `address2`, `town`, `city`, `postcode`, `organisation_name`, `company_number`, `vat_number`, `fa_affiliation`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`, `contact_with_email`)
VALUES
	(145,'The Football Association','',NULL,'jason@xanda.net','01622296755',NULL,' 0795 482 1350','01622296755',NULL,'1 New Union ','Square','',NULL,'HA9 0WS','Xanda Organisation test','undefined','undefined','undefined','2019-07-05 10:11:41',417,'2019-08-29 12:15:31',417,1,1),
	(146,'Tottenham Hotspur','',NULL,'daniel@xanda.net','02085555555',NULL,'0795555555','02085555555',NULL,'100 Tottenham High Road','Tottenham','',NULL,'N20 123','Tottenham Hotspur','undefined','undefined','undefined','2019-07-19 09:47:06',423,'2019-07-19 09:47:07',423,1,1),
	(147,'Shessi FC','',NULL,'icecube@icecube.com','5551234','Laki','','5551234',NULL,'187 South Central St','','',NULL,'N14 5RF','Shessi FC','undefined','undefined','undefined','2019-07-31 17:27:54',430,'2019-07-31 17:52:07',430,1,1),
	(148,'Shessi FC','',NULL,'icecube@cube.com','5551234',NULL,'','5551234',NULL,'187 South Central St','','',NULL,'N14 5RF','Shessi FC','undefined','undefined','undefined','2019-07-31 17:28:28',431,'2019-07-31 17:28:28',431,1,1),
	(149,'Xanda','',NULL,'daryan@xanda.net','07481822797',NULL,'','07481822797',NULL,'North london','','',NULL,'n2 n93','Xanda','undefined','undefined','undefined','2019-08-22 10:32:14',438,'2019-08-22 10:32:14',438,1,1),
	(150,'xandatest','',NULL,'test@xanda.net','012381289',NULL,'128238729','012381289',NULL,'test road','test','',NULL,'nw4 4qq','xandatest','undefined','undefined','undefined','2019-08-23 11:17:15',442,'2019-08-23 11:17:15',442,1,1);

/*!40000 ALTER TABLE `franchise` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table gocardless
# ------------------------------------------------------------

DROP TABLE IF EXISTS `gocardless`;

CREATE TABLE `gocardless` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) unsigned NOT NULL,
  `cardless_id` varchar(120) DEFAULT NULL,
  `session_token` varchar(120) DEFAULT NULL,
  `customer_status` tinyint(2) NOT NULL,
  `mandate` varchar(120) DEFAULT NULL,
  `customer` varchar(120) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `careldess_id` (`cardless_id`),
  KEY `session_token` (`session_token`),
  KEY `customer_status` (`customer_status`),
  KEY `mandate` (`mandate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `gocardless` WRITE;
/*!40000 ALTER TABLE `gocardless` DISABLE KEYS */;

INSERT INTO `gocardless` (`id`, `franchise_id`, `cardless_id`, `session_token`, `customer_status`, `mandate`, `customer`, `created_at`, `updated_at`)
VALUES
	(25,145,'RE0001S3YWV6YBK6R8KB3RA1SQQ8C14D','3bf7ab1eca3f4afd3e217692bb5604dc',1,'MD0005XR3A2RQG','CU00066MYZ9Y6P','2019-07-05 10:11:41','2019-07-05 10:13:12'),
	(26,146,'RE0001T3E31ZB3HS3DGCYXAQVAZJ96HE','aef9a337961cc5368ff4e34c3ea7c121',1,'MD00067GAB6AG3','CU0006GF94Z8RR','2019-07-19 09:47:07','2019-07-19 09:49:28'),
	(27,147,'RE0001V5ASSWC6T68TR3CY7VKGZR8S87','071de960b5e821f3cf777adfaad4ac2c',0,NULL,NULL,'2019-07-31 17:27:54','2019-07-31 17:27:54'),
	(28,148,'RE0001V5ATN25H50AF5V1X7GEPBT66HR','4545a8e5924c138ceba5048d9e0a38a6',0,NULL,NULL,'2019-07-31 17:28:28','2019-07-31 17:28:28'),
	(29,149,'RE0001WSYS6QJCXB4GG55P5035Z7FX5K','9b2b84e149cc5c467a35aa4a2730e036',1,'MD0006WVZYJT7Y','CU00076856WKXK','2019-08-22 10:32:14','2019-08-22 10:35:29'),
	(30,150,'RE0001WWPHKCY7VF7QES7HM6FY8NWNMD','c128832bd69d17a921ce479cae21aba0',1,'MD0006X2M5XY37','CU00076FCQ4RCP','2019-08-23 11:17:15','2019-08-23 11:17:30');

/*!40000 ALTER TABLE `gocardless` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table gocardless_charge
# ------------------------------------------------------------

DROP TABLE IF EXISTS `gocardless_charge`;

CREATE TABLE `gocardless_charge` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` int(11) NOT NULL,
  `amount` double(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `transaction_id` (`transaction_id`),
  CONSTRAINT `transaction_id` FOREIGN KEY (`transaction_id`) REFERENCES `transaction` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `gocardless_charge` WRITE;
/*!40000 ALTER TABLE `gocardless_charge` DISABLE KEYS */;

INSERT INTO `gocardless_charge` (`id`, `transaction_id`, `amount`, `created_at`, `updated_at`)
VALUES
	(11,20,0.25,'2019-07-05 11:16:02','2019-07-05 11:16:02'),
	(12,22,0.25,'2019-08-12 10:58:02','2019-08-12 10:58:02'),
	(13,23,0.25,'2019-08-27 10:52:01','2019-08-27 10:52:01');

/*!40000 ALTER TABLE `gocardless_charge` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table guardian_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `guardian_info`;

CREATE TABLE `guardian_info` (
  `user_id` int(11) NOT NULL,
  `notes` text,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table homework
# ------------------------------------------------------------

DROP TABLE IF EXISTS `homework`;

CREATE TABLE `homework` (
  `homework_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` bigint(20) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `coach_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`homework_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table invoice
# ------------------------------------------------------------

DROP TABLE IF EXISTS `invoice`;

CREATE TABLE `invoice` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `programme_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `player_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `type` enum('club','parent','coach') DEFAULT NULL,
  `company` enum('academy','fc') DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(8,2) NOT NULL,
  `invoice_number` varchar(64) DEFAULT NULL,
  `vat_rate` tinyint(2) DEFAULT NULL,
  `description` text,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `register_type` enum('fee','credit','receipt') DEFAULT NULL,
  `rel_club_package_id` int(11) DEFAULT NULL,
  `g_car_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`),
  KEY `user_id` (`user_id`),
  KEY `programme_id` (`programme_id`),
  KEY `session_id` (`session_id`),
  KEY `player_id` (`player_id`),
  KEY `team_id` (`team_id`),
  KEY `g_car_id` (`g_car_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='status: \n	for coach: \n		0 coach not been paid, \n		1 coach been paid';

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;

INSERT INTO `invoice` (`id`, `franchise_id`, `club_id`, `user_id`, `programme_id`, `session_id`, `player_id`, `team_id`, `status`, `type`, `company`, `date`, `amount`, `invoice_number`, `vat_rate`, `description`, `created_by`, `created_at`, `updated_by`, `updated_at`, `register_type`, `rel_club_package_id`, `g_car_id`)
VALUES
	(77,145,106,417,NULL,NULL,NULL,NULL,NULL,'club',NULL,'2019-07-05 11:10:01',25.00,'en7lmsneju8s48gook8sw4sco4c4og',NULL,'The Football Association',417,'2019-07-05 11:10:01',417,'2019-07-05 11:10:01',NULL,NULL,NULL),
	(78,145,105,420,12,52,NULL,315,0,'coach',NULL,'2019-07-06 18:30:00',20.00,NULL,0,'Holiday (Non-Residential) with The Gunners',418,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26','fee',NULL,NULL),
	(79,145,105,420,12,53,NULL,315,0,'coach',NULL,'2019-07-13 18:30:00',20.00,NULL,0,'Holiday (Non-Residential) with The Gunners',418,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26','fee',NULL,NULL),
	(80,145,105,420,12,54,NULL,315,0,'coach',NULL,'2019-07-20 18:30:00',20.00,NULL,0,'Holiday (Non-Residential) with The Gunners',418,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26','fee',NULL,NULL),
	(81,145,105,420,12,55,NULL,315,0,'coach',NULL,'2019-07-27 18:30:00',20.00,NULL,0,'Holiday (Non-Residential) with The Gunners',418,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26','fee',NULL,NULL),
	(82,145,105,420,12,56,NULL,315,0,'coach',NULL,'2019-08-03 18:30:00',20.00,NULL,0,'Holiday (Non-Residential) with The Gunners',418,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26','fee',NULL,NULL),
	(83,145,105,420,NULL,NULL,NULL,NULL,3,'coach',NULL,'2019-06-07 01:00:00',10.00,NULL,NULL,'Holiday session 1 fee',418,'2019-07-05 13:10:27',418,'2019-07-05 13:10:27','fee',NULL,NULL),
	(84,145,105,421,12,NULL,216,315,0,'parent',NULL,'2019-07-05 16:44:00',48.00,NULL,0,'Holiday (Non-Residential) for Jesse Lingard The Gunners',421,'2019-07-05 16:44:00',421,'2019-07-05 16:44:00',NULL,NULL,NULL),
	(85,145,105,422,12,NULL,217,315,0,'parent',NULL,'2019-07-08 15:45:25',36.00,NULL,0,'Holiday (Non-Residential) for Harry Kane The Gunners',422,'2019-07-08 15:45:25',422,'2019-07-08 15:45:25',NULL,NULL,NULL),
	(87,145,105,420,13,58,NULL,315,0,'coach',NULL,'2019-07-28 17:25:00',20.00,NULL,0,'dasd with The Gunners',418,'2019-07-17 15:50:26',418,'2019-07-17 15:50:26','fee',NULL,NULL),
	(88,145,105,420,13,59,NULL,315,0,'coach',NULL,'2019-07-29 17:25:00',20.00,NULL,0,'dasd with The Gunners',418,'2019-07-17 15:50:26',418,'2019-07-17 15:50:26','fee',NULL,NULL),
	(89,145,105,420,13,60,NULL,315,0,'coach',NULL,'2019-07-30 17:25:00',20.00,NULL,0,'dasd with The Gunners',418,'2019-07-17 15:50:26',418,'2019-07-17 15:50:26','fee',NULL,NULL),
	(90,146,107,426,14,61,NULL,320,0,'coach',NULL,'2019-09-11 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17','fee',NULL,NULL),
	(91,146,107,426,14,62,NULL,320,0,'coach',NULL,'2019-09-18 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17','fee',NULL,NULL),
	(92,146,107,426,14,63,NULL,320,0,'coach',NULL,'2019-09-25 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17','fee',NULL,NULL),
	(93,146,107,426,14,64,NULL,320,0,'coach',NULL,'2019-10-02 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17','fee',NULL,NULL),
	(94,146,107,426,14,65,NULL,320,0,'coach',NULL,'2019-10-09 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17','fee',NULL,NULL),
	(95,146,107,426,14,66,NULL,320,0,'coach',NULL,'2019-10-16 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17','fee',NULL,NULL),
	(96,146,107,426,14,67,NULL,320,0,'coach',NULL,'2019-10-30 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(97,146,107,426,14,68,NULL,320,0,'coach',NULL,'2019-11-06 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(98,146,107,426,14,69,NULL,320,0,'coach',NULL,'2019-11-13 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(99,146,107,426,14,70,NULL,320,0,'coach',NULL,'2019-11-20 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(100,146,107,426,14,71,NULL,320,0,'coach',NULL,'2019-11-27 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(101,146,107,426,14,72,NULL,320,0,'coach',NULL,'2019-12-04 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(102,146,107,426,14,73,NULL,320,0,'coach',NULL,'2019-12-11 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(103,146,107,426,14,74,NULL,320,0,'coach',NULL,'2019-12-18 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(104,146,107,426,14,75,NULL,320,0,'coach',NULL,'2019-12-25 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(105,146,107,426,14,76,NULL,320,0,'coach',NULL,'2020-01-01 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(106,146,107,426,14,77,NULL,320,0,'coach',NULL,'2020-01-08 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(107,146,107,426,14,78,NULL,320,0,'coach',NULL,'2020-01-15 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(108,146,107,426,14,79,NULL,320,0,'coach',NULL,'2020-01-22 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(109,146,107,426,14,80,NULL,320,0,'coach',NULL,'2020-01-29 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(110,146,107,426,14,81,NULL,320,0,'coach',NULL,'2020-02-05 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(111,146,107,426,14,82,NULL,320,0,'coach',NULL,'2020-02-12 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(112,146,107,426,14,83,NULL,320,0,'coach',NULL,'2020-02-19 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(113,146,107,426,14,84,NULL,320,0,'coach',NULL,'2020-02-26 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(114,146,107,426,14,85,NULL,320,0,'coach',NULL,'2020-03-04 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(115,146,107,426,14,86,NULL,320,0,'coach',NULL,'2020-03-11 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(116,146,107,426,14,87,NULL,320,0,'coach',NULL,'2020-03-18 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(117,146,107,426,14,88,NULL,320,0,'coach',NULL,'2020-04-01 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(118,146,107,426,14,89,NULL,320,0,'coach',NULL,'2020-04-08 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(119,146,107,426,14,90,NULL,320,0,'coach',NULL,'2020-04-15 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(120,146,107,426,14,91,NULL,320,0,'coach',NULL,'2020-04-22 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(121,146,107,426,14,92,NULL,320,0,'coach',NULL,'2020-04-29 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(122,146,107,426,14,93,NULL,320,0,'coach',NULL,'2020-05-06 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Cubs Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(123,146,107,426,15,94,NULL,322,0,'coach',NULL,'2019-09-11 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(124,146,107,426,15,95,NULL,322,0,'coach',NULL,'2019-09-18 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(125,146,107,426,15,96,NULL,322,0,'coach',NULL,'2019-09-25 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(126,146,107,426,15,97,NULL,322,0,'coach',NULL,'2019-10-02 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(127,146,107,426,15,98,NULL,322,0,'coach',NULL,'2019-10-09 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(128,146,107,426,15,99,NULL,322,0,'coach',NULL,'2019-10-16 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(129,146,107,426,15,100,NULL,322,0,'coach',NULL,'2019-10-30 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(130,146,107,426,15,101,NULL,322,0,'coach',NULL,'2019-11-06 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(131,146,107,426,15,102,NULL,322,0,'coach',NULL,'2019-11-13 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(132,146,107,426,15,103,NULL,322,0,'coach',NULL,'2019-11-20 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(133,146,107,426,15,104,NULL,322,0,'coach',NULL,'2019-11-27 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(134,146,107,426,15,105,NULL,322,0,'coach',NULL,'2019-12-04 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(135,146,107,426,15,106,NULL,322,0,'coach',NULL,'2019-12-11 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(136,146,107,426,15,107,NULL,322,0,'coach',NULL,'2019-12-18 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(137,146,107,426,15,108,NULL,322,0,'coach',NULL,'2019-12-25 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(138,146,107,426,15,109,NULL,322,0,'coach',NULL,'2020-01-01 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(139,146,107,426,15,110,NULL,322,0,'coach',NULL,'2020-01-08 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(140,146,107,426,15,111,NULL,322,0,'coach',NULL,'2020-01-15 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(141,146,107,426,15,112,NULL,322,0,'coach',NULL,'2020-01-22 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(142,146,107,426,15,113,NULL,322,0,'coach',NULL,'2020-01-29 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(143,146,107,426,15,114,NULL,322,0,'coach',NULL,'2020-02-05 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(144,146,107,426,15,115,NULL,322,0,'coach',NULL,'2020-02-12 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(145,146,107,426,15,116,NULL,322,0,'coach',NULL,'2020-02-19 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(146,146,107,426,15,117,NULL,322,0,'coach',NULL,'2020-02-26 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(147,146,107,426,15,118,NULL,322,0,'coach',NULL,'2020-03-04 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(148,146,107,426,15,119,NULL,322,0,'coach',NULL,'2020-03-11 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(149,146,107,426,15,120,NULL,322,0,'coach',NULL,'2020-03-18 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(150,146,107,426,15,121,NULL,322,0,'coach',NULL,'2020-04-01 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(151,146,107,426,15,122,NULL,322,0,'coach',NULL,'2020-04-08 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(152,146,107,426,15,123,NULL,322,0,'coach',NULL,'2020-04-15 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(153,146,107,426,15,124,NULL,322,0,'coach',NULL,'2020-04-22 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(154,146,107,426,15,125,NULL,322,0,'coach',NULL,'2020-04-29 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(155,146,107,426,15,126,NULL,322,0,'coach',NULL,'2020-05-06 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Team Rats',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(156,146,107,426,16,127,NULL,321,0,'coach',NULL,'2019-09-11 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(157,146,107,426,16,128,NULL,321,0,'coach',NULL,'2019-09-18 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(158,146,107,426,16,129,NULL,321,0,'coach',NULL,'2019-09-25 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(159,146,107,426,16,130,NULL,321,0,'coach',NULL,'2019-10-02 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(160,146,107,426,16,131,NULL,321,0,'coach',NULL,'2019-10-09 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(161,146,107,426,16,132,NULL,321,0,'coach',NULL,'2019-10-16 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(162,146,107,426,16,133,NULL,321,0,'coach',NULL,'2019-10-30 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(163,146,107,426,16,134,NULL,321,0,'coach',NULL,'2019-11-06 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(164,146,107,426,16,135,NULL,321,0,'coach',NULL,'2019-11-13 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(165,146,107,426,16,136,NULL,321,0,'coach',NULL,'2019-11-20 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(166,146,107,426,16,137,NULL,321,0,'coach',NULL,'2019-11-27 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(167,146,107,426,16,138,NULL,321,0,'coach',NULL,'2019-12-04 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(168,146,107,426,16,139,NULL,321,0,'coach',NULL,'2019-12-11 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(169,146,107,426,16,140,NULL,321,0,'coach',NULL,'2019-12-18 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(170,146,107,426,16,141,NULL,321,0,'coach',NULL,'2019-12-25 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(171,146,107,426,16,142,NULL,321,0,'coach',NULL,'2020-01-01 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(172,146,107,426,16,143,NULL,321,0,'coach',NULL,'2020-01-08 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(173,146,107,426,16,144,NULL,321,0,'coach',NULL,'2020-01-15 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(174,146,107,426,16,145,NULL,321,0,'coach',NULL,'2020-01-22 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(175,146,107,426,16,146,NULL,321,0,'coach',NULL,'2020-01-29 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(176,146,107,426,16,147,NULL,321,0,'coach',NULL,'2020-02-05 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(177,146,107,426,16,148,NULL,321,0,'coach',NULL,'2020-02-12 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(178,146,107,426,16,149,NULL,321,0,'coach',NULL,'2020-02-19 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(179,146,107,426,16,150,NULL,321,0,'coach',NULL,'2020-02-26 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(180,146,107,426,16,151,NULL,321,0,'coach',NULL,'2020-03-04 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(181,146,107,426,16,152,NULL,321,0,'coach',NULL,'2020-03-11 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(182,146,107,426,16,153,NULL,321,0,'coach',NULL,'2020-03-18 10:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(183,146,107,426,16,154,NULL,321,0,'coach',NULL,'2020-04-01 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(184,146,107,426,16,155,NULL,321,0,'coach',NULL,'2020-04-08 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(185,146,107,426,16,156,NULL,321,0,'coach',NULL,'2020-04-15 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(186,146,107,426,16,157,NULL,321,0,'coach',NULL,'2020-04-22 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(187,146,107,426,16,158,NULL,321,0,'coach',NULL,'2020-04-29 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(188,146,107,426,16,159,NULL,321,0,'coach',NULL,'2020-05-06 11:45:00',10.00,NULL,20,'Mid-Week Training (Wednesdays) with Tigers Team',424,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18','fee',NULL,NULL),
	(190,146,107,426,17,161,NULL,317,0,'coach',NULL,'2019-07-27 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(192,146,107,426,17,163,NULL,317,0,'coach',NULL,'2019-08-10 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(193,146,107,426,17,164,NULL,317,0,'coach',NULL,'2019-08-17 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(194,146,107,426,17,165,NULL,317,0,'coach',NULL,'2019-08-24 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(195,146,107,426,17,166,NULL,317,0,'coach',NULL,'2019-08-31 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(196,146,107,426,17,167,NULL,317,0,'coach',NULL,'2019-09-07 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(197,146,107,426,17,168,NULL,317,0,'coach',NULL,'2019-09-14 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(198,146,107,426,17,169,NULL,317,0,'coach',NULL,'2019-09-21 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(199,146,107,426,17,170,NULL,317,0,'coach',NULL,'2019-09-28 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(200,146,107,426,17,171,NULL,317,0,'coach',NULL,'2019-10-05 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(201,146,107,426,17,172,NULL,317,0,'coach',NULL,'2019-10-12 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(202,146,107,426,17,173,NULL,317,0,'coach',NULL,'2019-10-19 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(203,146,107,426,17,174,NULL,317,0,'coach',NULL,'2019-10-26 11:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(204,146,107,426,17,175,NULL,317,0,'coach',NULL,'2019-11-02 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(205,146,107,426,17,176,NULL,317,0,'coach',NULL,'2019-11-09 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(206,146,107,426,17,177,NULL,317,0,'coach',NULL,'2019-11-16 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(207,146,107,426,17,178,NULL,317,0,'coach',NULL,'2019-11-23 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(208,146,107,426,17,179,NULL,317,0,'coach',NULL,'2019-11-30 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(209,146,107,426,17,180,NULL,317,0,'coach',NULL,'2019-12-07 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(210,146,107,426,17,181,NULL,317,0,'coach',NULL,'2019-12-14 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(211,146,107,426,17,182,NULL,317,0,'coach',NULL,'2019-12-21 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(212,146,107,426,17,183,NULL,317,0,'coach',NULL,'2019-12-28 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(213,146,107,426,17,184,NULL,317,0,'coach',NULL,'2020-01-04 10:45:00',10.00,NULL,20,'Saturday Academy with Cubs',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(215,146,107,426,18,186,NULL,318,0,'coach',NULL,'2019-07-27 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(216,146,107,426,18,187,NULL,318,0,'coach',NULL,'2019-08-03 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(217,146,107,426,18,188,NULL,318,0,'coach',NULL,'2019-08-10 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(218,146,107,426,18,189,NULL,318,0,'coach',NULL,'2019-08-17 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(219,146,107,426,18,190,NULL,318,0,'coach',NULL,'2019-08-24 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(220,146,107,426,18,191,NULL,318,0,'coach',NULL,'2019-08-31 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(221,146,107,426,18,192,NULL,318,0,'coach',NULL,'2019-09-07 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(222,146,107,426,18,193,NULL,318,0,'coach',NULL,'2019-09-14 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(223,146,107,426,18,194,NULL,318,0,'coach',NULL,'2019-09-21 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(224,146,107,426,18,195,NULL,318,0,'coach',NULL,'2019-09-28 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(225,146,107,426,18,196,NULL,318,0,'coach',NULL,'2019-10-05 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(226,146,107,426,18,197,NULL,318,0,'coach',NULL,'2019-10-12 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(227,146,107,426,18,198,NULL,318,0,'coach',NULL,'2019-10-19 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(228,146,107,426,18,199,NULL,318,0,'coach',NULL,'2019-10-26 11:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(229,146,107,426,18,200,NULL,318,0,'coach',NULL,'2019-11-02 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(230,146,107,426,18,201,NULL,318,0,'coach',NULL,'2019-11-09 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(231,146,107,426,18,202,NULL,318,0,'coach',NULL,'2019-11-16 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(232,146,107,426,18,203,NULL,318,0,'coach',NULL,'2019-11-23 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(233,146,107,426,18,204,NULL,318,0,'coach',NULL,'2019-11-30 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(234,146,107,426,18,205,NULL,318,0,'coach',NULL,'2019-12-07 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(235,146,107,426,18,206,NULL,318,0,'coach',NULL,'2019-12-14 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(236,146,107,426,18,207,NULL,318,0,'coach',NULL,'2019-12-21 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(237,146,107,426,18,208,NULL,318,0,'coach',NULL,'2019-12-28 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(238,146,107,426,18,209,NULL,318,0,'coach',NULL,'2020-01-04 10:45:00',10.00,NULL,20,'Saturday Academy with Tigers',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(240,146,107,426,19,211,NULL,319,0,'coach',NULL,'2019-07-27 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(242,146,107,426,19,213,NULL,319,0,'coach',NULL,'2019-08-10 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(243,146,107,426,19,214,NULL,319,0,'coach',NULL,'2019-08-17 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(244,146,107,426,19,215,NULL,319,0,'coach',NULL,'2019-08-24 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(245,146,107,426,19,216,NULL,319,0,'coach',NULL,'2019-08-31 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(246,146,107,426,19,217,NULL,319,0,'coach',NULL,'2019-09-07 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(247,146,107,426,19,218,NULL,319,0,'coach',NULL,'2019-09-14 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(248,146,107,426,19,219,NULL,319,0,'coach',NULL,'2019-09-21 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(249,146,107,426,19,220,NULL,319,0,'coach',NULL,'2019-09-28 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(250,146,107,426,19,221,NULL,319,0,'coach',NULL,'2019-10-05 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(251,146,107,426,19,222,NULL,319,0,'coach',NULL,'2019-10-12 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(252,146,107,426,19,223,NULL,319,0,'coach',NULL,'2019-10-19 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(253,146,107,426,19,224,NULL,319,0,'coach',NULL,'2019-10-26 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(254,146,107,426,19,225,NULL,319,0,'coach',NULL,'2019-11-02 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(255,146,107,426,19,226,NULL,319,0,'coach',NULL,'2019-11-09 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(256,146,107,426,19,227,NULL,319,0,'coach',NULL,'2019-11-16 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(257,146,107,426,19,228,NULL,319,0,'coach',NULL,'2019-11-23 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(258,146,107,426,19,229,NULL,319,0,'coach',NULL,'2019-11-30 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(259,146,107,426,19,230,NULL,319,0,'coach',NULL,'2019-12-07 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(260,146,107,426,19,231,NULL,319,0,'coach',NULL,'2019-12-14 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(261,146,107,426,19,232,NULL,319,0,'coach',NULL,'2019-12-21 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(262,146,107,426,19,233,NULL,319,0,'coach',NULL,'2019-12-28 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(263,146,107,426,19,234,NULL,319,0,'coach',NULL,'2020-01-04 10:45:00',10.00,NULL,20,'Saturday Academy with Rats',424,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40','fee',NULL,NULL),
	(264,146,107,426,NULL,NULL,NULL,NULL,3,'coach',NULL,'2019-07-19 01:00:00',-100.00,NULL,NULL,'Bonus',424,'2019-07-19 11:33:00',424,'2019-07-19 11:33:00','credit',NULL,NULL),
	(265,146,107,427,19,212,NULL,319,NULL,NULL,NULL,'2019-08-03 11:45:00',21.00,NULL,20,'Saturday Academy with Rats',0,'2019-07-19 11:46:08',424,'2019-07-19 11:46:08',NULL,NULL,NULL),
	(266,146,107,428,19,NULL,218,319,0,'parent',NULL,'2019-07-19 12:19:18',325.00,NULL,20,'Saturday Academy for Harry Kane Rats',428,'2019-07-19 12:19:18',428,'2019-07-19 12:19:18',NULL,NULL,NULL),
	(268,146,107,427,17,160,NULL,317,NULL,NULL,NULL,'2019-07-20 11:45:00',21.00,NULL,20,'Saturday Academy with Cubs',0,'2019-07-19 16:01:32',424,'2019-07-19 16:01:32',NULL,NULL,NULL),
	(269,146,107,427,17,162,NULL,317,NULL,NULL,NULL,'2019-08-03 11:45:00',21.00,NULL,20,'Saturday Academy with Cubs',0,'2019-07-19 16:01:45',424,'2019-07-19 16:01:45',NULL,NULL,NULL),
	(270,146,107,427,18,185,NULL,318,NULL,NULL,NULL,'2019-07-20 11:45:00',21.00,NULL,20,'Saturday Academy with Tigers',0,'2019-07-19 16:02:19',424,'2019-07-19 16:02:19',NULL,NULL,NULL),
	(271,146,107,426,19,210,NULL,319,NULL,NULL,NULL,'2019-07-20 11:45:00',10.00,NULL,20,'Saturday Academy with Rats',0,'2019-07-19 16:03:44',424,'2019-07-19 16:03:44',NULL,NULL,NULL),
	(272,146,107,427,20,235,NULL,319,0,'coach',NULL,'2019-08-03 17:30:00',21.00,NULL,20,'Programme 2 with Rats',425,'2019-07-22 10:40:54',425,'2019-07-22 10:40:54','fee',NULL,NULL),
	(273,146,107,427,20,236,NULL,319,0,'coach',NULL,'2019-08-10 17:30:00',21.00,NULL,20,'Programme 2 with Rats',425,'2019-07-22 10:40:54',425,'2019-07-22 10:40:54','fee',NULL,NULL),
	(274,146,107,428,20,NULL,218,319,0,'parent',NULL,'2019-07-22 12:54:23',20.00,NULL,20,'Programme 2 for Harry Kane Rats',428,'2019-07-22 12:54:23',428,'2019-07-22 12:54:23',NULL,NULL,NULL),
	(275,146,107,426,21,237,NULL,318,0,'coach',NULL,'2019-08-03 17:30:00',10.00,NULL,20,'Programme 2 with Tigers',425,'2019-07-22 13:20:47',425,'2019-07-22 13:20:47','fee',NULL,NULL),
	(276,146,107,426,21,238,NULL,318,0,'coach',NULL,'2019-08-10 17:30:00',10.00,NULL,20,'Programme 2 with Tigers',425,'2019-07-22 13:20:47',425,'2019-07-22 13:20:47','fee',NULL,NULL),
	(277,146,107,426,22,239,NULL,319,0,'coach',NULL,'2019-08-03 17:30:00',10.00,NULL,20,'Programme 3 with Rats',425,'2019-07-22 13:23:04',425,'2019-07-22 13:23:04','fee',NULL,NULL),
	(278,146,107,426,22,240,NULL,319,0,'coach',NULL,'2019-08-10 17:30:00',10.00,NULL,20,'Programme 3 with Rats',425,'2019-07-22 13:23:04',425,'2019-07-22 13:23:04','fee',NULL,NULL),
	(279,146,107,428,22,NULL,218,319,0,'parent',NULL,'2019-07-22 13:23:54',20.00,NULL,20,'Programme 3 for Harry Kane Rats',428,'2019-07-22 13:23:54',428,'2019-07-22 13:23:54',NULL,NULL,NULL),
	(280,145,105,429,13,57,NULL,315,NULL,NULL,NULL,'2019-08-10 17:25:00',11.00,NULL,0,'dasd with The Gunners',0,'2019-07-22 16:08:01',418,'2019-07-22 16:08:01',NULL,NULL,NULL),
	(281,145,106,417,NULL,NULL,NULL,NULL,NULL,'club',NULL,'2019-08-04 12:52:01',25.00,'32zts4o0gy0400o40800oko840c08w',NULL,'The Football Association',417,'2019-08-04 12:52:01',417,'2019-08-04 12:52:01',NULL,NULL,NULL),
	(282,145,105,420,23,241,NULL,327,0,'coach',NULL,'2019-08-21 17:30:00',20.00,NULL,0,'Bradshaw Programmes with Lions',418,'2019-08-14 11:48:05',418,'2019-08-14 11:48:05','fee',NULL,NULL),
	(283,145,105,420,23,242,NULL,327,0,'coach',NULL,'2019-08-28 17:30:00',20.00,NULL,0,'Bradshaw Programmes with Lions',418,'2019-08-14 11:48:05',418,'2019-08-14 11:48:05','fee',NULL,NULL),
	(284,145,105,421,13,NULL,216,315,0,'parent',NULL,'2019-08-14 12:10:51',10.00,NULL,0,'dasd for Jesse Lingard The Gunners',421,'2019-08-14 12:10:51',421,'2019-08-14 12:10:51',NULL,NULL,NULL),
	(285,146,107,423,NULL,NULL,NULL,NULL,NULL,'club',NULL,'2019-08-18 09:48:02',25.00,'k3y9rdbzv5s0wsos0kws44k04kswsk',NULL,'Tottenham Hotspur',423,'2019-08-18 09:48:01',423,'2019-08-18 09:48:01',NULL,NULL,NULL),
	(286,145,105,420,24,243,NULL,327,0,'coach',NULL,'2019-08-25 17:30:00',20.00,NULL,0,'Under 18s - Lions vs opposition with Lions',418,'2019-08-19 09:42:12',418,'2019-08-19 09:42:12','fee',NULL,NULL),
	(287,145,105,429,25,244,NULL,327,0,'coach',NULL,'2019-08-25 16:30:00',11.00,NULL,0,'newclub2 with Lions',418,'2019-08-19 12:08:30',418,'2019-08-29 12:32:51','fee',NULL,NULL),
	(288,145,105,429,25,245,NULL,327,0,'coach',NULL,'2019-09-01 16:30:00',11.00,NULL,0,'newclub2 with Lions',418,'2019-08-19 12:08:30',418,'2019-08-19 12:08:30','fee',NULL,NULL),
	(289,145,105,437,26,246,NULL,327,0,'coach',NULL,'2019-08-25 17:30:00',15.00,NULL,0,'Archive People 2 with Lions',418,'2019-08-19 12:12:56',418,'2019-08-19 12:12:56','fee',NULL,NULL),
	(290,145,105,437,26,247,NULL,327,0,'coach',NULL,'2019-09-01 17:30:00',15.00,NULL,0,'Archive People 2 with Lions',418,'2019-08-19 12:12:56',418,'2019-08-19 12:12:56','fee',NULL,NULL),
	(291,145,105,437,27,248,NULL,327,0,'coach',NULL,'2019-08-25 17:30:00',15.00,NULL,0,'Archive People 2 with Lions',418,'2019-08-19 12:14:08',418,'2019-08-19 12:14:08','fee',NULL,NULL),
	(292,145,105,437,27,249,NULL,327,0,'coach',NULL,'2019-09-01 17:30:00',15.00,NULL,0,'Archive People 2 with Lions',418,'2019-08-19 12:14:08',418,'2019-08-19 12:14:08','fee',NULL,NULL),
	(293,145,105,437,28,250,NULL,327,0,'coach',NULL,'2019-08-25 17:30:00',15.00,NULL,0,'Archive People 2 with Lions',418,'2019-08-19 12:16:35',418,'2019-08-19 12:16:35','fee',NULL,NULL),
	(294,145,105,437,28,251,NULL,327,0,'coach',NULL,'2019-09-01 17:30:00',15.00,NULL,0,'Archive People 2 with Lions',418,'2019-08-19 12:16:35',418,'2019-08-19 12:16:35','fee',NULL,NULL),
	(295,145,105,420,29,252,NULL,334,0,'coach',NULL,'2019-08-25 17:30:00',20.00,NULL,0,'New programme with Team Test P 6',418,'2019-08-20 15:22:15',418,'2019-08-20 15:22:15','fee',NULL,NULL),
	(296,145,105,420,29,253,NULL,334,0,'coach',NULL,'2019-09-01 17:30:00',20.00,NULL,0,'New programme with Team Test P 6',418,'2019-08-20 15:22:16',418,'2019-08-20 15:22:16','fee',NULL,NULL),
	(298,145,105,429,30,254,NULL,332,NULL,NULL,NULL,'2019-08-30 11:40:00',11.00,NULL,0,'Under 15s - Test 6 vs t with Test 6',0,'2019-08-29 11:54:24',418,'2019-08-29 11:54:24',NULL,NULL,NULL);

/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table invoice_line
# ------------------------------------------------------------

DROP TABLE IF EXISTS `invoice_line`;

CREATE TABLE `invoice_line` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_id` int(11) NOT NULL,
  `club_id` int(11) DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `package_id` (`package_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `invoice_line` WRITE;
/*!40000 ALTER TABLE `invoice_line` DISABLE KEYS */;

INSERT INTO `invoice_line` (`id`, `invoice_id`, `club_id`, `package_id`, `title`, `amount`, `created_at`, `updated_at`)
VALUES
	(56,77,106,39,'The Football Association',10.00,'2019-07-05 11:10:01','2019-07-05 11:10:01'),
	(57,77,105,40,'The Football Association',15.00,'2019-07-05 11:10:02','2019-07-05 11:10:02'),
	(58,84,NULL,NULL,'Sat, 6th Jul 2019 17:30 - 17:30',12.00,'2019-07-05 16:44:00','2019-07-05 16:44:00'),
	(59,84,NULL,NULL,'Sat, 13th Jul 2019 17:30 - 17:30',12.00,'2019-07-05 16:44:00','2019-07-05 16:44:00'),
	(60,84,NULL,NULL,'Sat, 27th Jul 2019 17:30 - 17:30',12.00,'2019-07-05 16:44:00','2019-07-05 16:44:00'),
	(61,84,NULL,NULL,'Sat, 3rd Aug 2019 17:30 - 17:30',12.00,'2019-07-05 16:44:00','2019-07-05 16:44:00'),
	(62,85,NULL,NULL,'Sat, 13th Jul 2019 17:30 - 17:30',12.00,'2019-07-08 15:45:25','2019-07-08 15:45:25'),
	(63,85,NULL,NULL,'Sat, 27th Jul 2019 17:30 - 17:30',12.00,'2019-07-08 15:45:25','2019-07-08 15:45:25'),
	(64,85,NULL,NULL,'Sat, 3rd Aug 2019 17:30 - 17:30',12.00,'2019-07-08 15:45:25','2019-07-08 15:45:25'),
	(65,266,NULL,NULL,'Sat, 20th Jul 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(66,266,NULL,NULL,'Sat, 27th Jul 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(67,266,NULL,NULL,'Sat, 3rd Aug 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(68,266,NULL,NULL,'Sat, 10th Aug 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(69,266,NULL,NULL,'Sat, 17th Aug 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(70,266,NULL,NULL,'Sat, 24th Aug 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(71,266,NULL,NULL,'Sat, 31st Aug 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(72,266,NULL,NULL,'Sat, 7th Sep 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(73,266,NULL,NULL,'Sat, 14th Sep 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(74,266,NULL,NULL,'Sat, 21st Sep 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(75,266,NULL,NULL,'Sat, 28th Sep 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(76,266,NULL,NULL,'Sat, 5th Oct 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(77,266,NULL,NULL,'Sat, 12th Oct 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(78,266,NULL,NULL,'Sat, 19th Oct 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(79,266,NULL,NULL,'Sat, 26th Oct 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(80,266,NULL,NULL,'Sat, 2nd Nov 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(81,266,NULL,NULL,'Sat, 9th Nov 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(82,266,NULL,NULL,'Sat, 16th Nov 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(83,266,NULL,NULL,'Sat, 23rd Nov 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(84,266,NULL,NULL,'Sat, 30th Nov 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(85,266,NULL,NULL,'Sat, 7th Dec 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(86,266,NULL,NULL,'Sat, 14th Dec 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(87,266,NULL,NULL,'Sat, 21st Dec 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(88,266,NULL,NULL,'Sat, 28th Dec 2019 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(89,266,NULL,NULL,'Sat, 4th Jan 2020 10:45 - 10:45',13.00,'2019-07-19 12:19:18','2019-07-19 12:19:18'),
	(90,274,NULL,NULL,'Sat, 3rd Aug 2019 16:30 - 16:30',10.00,'2019-07-22 12:54:23','2019-07-22 12:54:23'),
	(91,274,NULL,NULL,'Sat, 10th Aug 2019 16:30 - 16:30',10.00,'2019-07-22 12:54:23','2019-07-22 12:54:23'),
	(92,279,NULL,NULL,'Sat, 3rd Aug 2019 16:30 - 16:30',10.00,'2019-07-22 13:23:54','2019-07-22 13:23:54'),
	(93,279,NULL,NULL,'Sat, 10th Aug 2019 16:30 - 16:30',10.00,'2019-07-22 13:23:54','2019-07-22 13:23:54'),
	(94,281,106,39,'The Football Association',10.00,'2019-08-04 12:52:01','2019-08-04 12:52:01'),
	(95,281,105,40,'The Football Association',15.00,'2019-08-04 12:52:01','2019-08-04 12:52:01'),
	(96,284,NULL,NULL,'Wed, 28th Aug 2019 17:00 - 17:00',10.00,'2019-08-14 12:10:51','2019-08-14 12:10:51'),
	(97,285,107,41,'Tottenham Hotspur',25.00,'2019-08-18 09:48:02','2019-08-18 09:48:02');

/*!40000 ALTER TABLE `invoice_line` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table kit_item
# ------------------------------------------------------------

DROP TABLE IF EXISTS `kit_item`;

CREATE TABLE `kit_item` (
  `kit_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) unsigned NOT NULL,
  `club_id` int(11) unsigned NOT NULL,
  `type_id` int(11) unsigned NOT NULL,
  `is_player_assignment` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `product_sku` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`kit_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`),
  KEY `product_sku` (`product_sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `kit_item` WRITE;
/*!40000 ALTER TABLE `kit_item` DISABLE KEYS */;

INSERT INTO `kit_item` (`kit_id`, `franchise_id`, `club_id`, `type_id`, `is_player_assignment`, `status`, `title`, `image_url`, `product_sku`, `created_at`, `created_by`, `updated_at`, `updated_by`)
VALUES
	(87,145,105,1,0,1,'Football Bibs','http://api2.grassroots.hostings.co.uk/storage/kit/145/1562329871_productimage.jpeg','PD01','2019-07-05 13:31:11',418,'2019-07-05 13:31:11',418),
	(88,145,105,2,0,1,'T Shirt','http://api2.grassroots.hostings.co.uk/storage/kit/145/1562329951_images(1).jpeg','PD02','2019-07-05 13:32:31',418,'2019-07-05 13:32:31',418),
	(89,145,105,2,0,1,'Academy Dynamic Fit MG','http://api2.grassroots.hostings.co.uk/storage/kit/145/1562330056_AO3287_410.jpeg','PD03','2019-07-05 13:34:16',418,'2019-07-05 13:34:16',418),
	(90,145,105,2,0,1,'Football Socks Mens','http://api2.grassroots.hostings.co.uk/storage/kit/145/1562330123_41710803_l.jpg','PD04','2019-07-05 13:35:23',418,'2019-07-05 13:35:23',418),
	(91,145,105,1,0,1,'Match top','http://api2.grassroots.hostings.co.uk/storage/kit/145/1562596894_download.jpeg','MATTOP','2019-07-08 15:41:34',418,'2019-07-08 15:41:34',418),
	(92,146,107,1,0,1,'Tracksuit','http://api2.grassroots.hostings.co.uk/storage/kit/146/1563528577_AT017E4S020LS_462.jpg','TRACK','2019-07-19 10:29:37',424,'2019-07-19 10:29:37',424),
	(93,146,107,1,0,1,'Shorts','http://api2.grassroots.hostings.co.uk/storage/kit/146/1563528616_modern-tempo-womens-3-running-shorts.jpg','SHORT','2019-07-19 10:30:16',424,'2019-07-19 10:30:16',424),
	(94,146,107,1,0,1,'Top','http://api2.grassroots.hostings.co.uk/storage/kit/146/1563528638_AT017E4S020LS_462.jpg','TOP','2019-07-19 10:30:38',424,'2019-07-19 10:30:38',424),
	(95,146,107,2,0,1,'Match Shorts','http://api2.grassroots.hostings.co.uk/storage/kit/146/1563528666_modern-tempo-womens-3-running-shorts.jpg','MCHSHORTS','2019-07-19 10:31:06',424,'2019-07-19 10:31:06',424),
	(96,146,107,2,0,1,'T-Shirt','http://api2.grassroots.hostings.co.uk/storage/kit/146/1563528686_download.jpeg','TSHIRT','2019-07-19 10:31:26',424,'2019-07-19 10:31:26',424),
	(97,146,107,3,0,1,'Training Shorts','http://api2.grassroots.hostings.co.uk/storage/kit/146/1563528701_modern-tempo-womens-3-running-shorts.jpg','TRSHORTS','2019-07-19 10:31:41',424,'2019-07-19 10:31:41',424),
	(98,146,107,4,0,1,'Track Top','http://api2.grassroots.hostings.co.uk/storage/kit/146/1563528715_AT017E4S020LS_462.jpg','TRTOP','2019-07-19 10:31:55',424,'2019-07-19 10:31:55',424),
	(99,146,107,4,0,1,'Socks','http://api2.grassroots.hostings.co.uk/storage/kit/146/1563535344_download.jpeg','Socks','2019-07-19 12:22:24',424,'2019-07-19 12:22:24',424);

/*!40000 ALTER TABLE `kit_item` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table kit_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `kit_type`;

CREATE TABLE `kit_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`type_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `kit_type` WRITE;
/*!40000 ALTER TABLE `kit_type` DISABLE KEYS */;

INSERT INTO `kit_type` (`type_id`, `franchise_id`, `club_id`, `title`, `created_at`, `created_by`, `status`)
VALUES
	(1,0,0,'Coaching','2017-06-29 12:55:15',2,1),
	(2,0,0,'Match','2017-06-29 12:55:14',2,1),
	(3,0,0,'Training','2017-06-29 12:55:14',2,1),
	(4,0,0,'Track','2017-09-05 12:35:32',2,1),
	(5,0,0,'Others','2017-09-05 12:35:35',2,1);

/*!40000 ALTER TABLE `kit_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table kit_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `kit_user`;

CREATE TABLE `kit_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_player_id` int(11) DEFAULT NULL,
  `kit_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `user_role` enum('coach','parent','player') DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `kit_user` WRITE;
/*!40000 ALTER TABLE `kit_user` DISABLE KEYS */;

INSERT INTO `kit_user` (`id`, `user_player_id`, `kit_id`, `team_id`, `user_role`, `size`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`)
VALUES
	(137,217,87,315,'player',NULL,0,418,418,'2019-07-08 15:45:14','2019-07-08 15:45:14'),
	(138,217,88,315,'player',NULL,0,418,418,'2019-07-08 15:45:14','2019-07-08 15:45:14'),
	(139,217,89,315,'player',NULL,0,418,418,'2019-07-08 15:45:14','2019-07-08 15:45:14'),
	(140,217,90,315,'player',NULL,0,418,418,'2019-07-08 15:45:14','2019-07-08 15:45:14'),
	(142,218,99,319,'player',NULL,0,424,424,'2019-07-19 16:13:11','2019-07-19 16:13:11'),
	(143,219,92,NULL,'player','m',1,424,424,'2019-07-31 15:53:16','2019-07-31 15:53:24'),
	(144,219,95,NULL,'player','l',0,424,424,'2019-07-31 15:53:16','2019-07-31 15:53:16'),
	(145,218,92,324,'player',NULL,0,424,424,'2019-07-31 15:54:06','2019-07-31 15:54:06'),
	(146,218,93,324,'player',NULL,0,424,424,'2019-07-31 15:54:06','2019-07-31 15:54:06'),
	(147,218,95,324,'player',NULL,0,424,424,'2019-07-31 15:54:06','2019-07-31 15:54:06'),
	(148,218,96,324,'player',NULL,0,424,424,'2019-07-31 15:54:06','2019-07-31 15:54:06');

/*!40000 ALTER TABLE `kit_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table match
# ------------------------------------------------------------

DROP TABLE IF EXISTS `match`;

CREATE TABLE `match` (
  `fixture_id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `type_id` int(11) unsigned NOT NULL,
  `kickoff_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `referee` varchar(255) DEFAULT NULL,
  `referee_contact_number` varchar(15) DEFAULT NULL,
  `oposition` varchar(255) NOT NULL,
  `opposition_contact_number` varchar(15) DEFAULT NULL,
  `notes` text,
  `match_location` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`fixture_id`),
  KEY `session_id` (`session_id`),
  KEY `type_id` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `match` WRITE;
/*!40000 ALTER TABLE `match` DISABLE KEYS */;

INSERT INTO `match` (`fixture_id`, `session_id`, `type_id`, `kickoff_time`, `referee`, `referee_contact_number`, `oposition`, `opposition_contact_number`, `notes`, `match_location`)
VALUES
	(1,243,1,'2019-08-25 17:45:00','jon doe',NULL,'opposition',NULL,'asdf','home'),
	(2,254,7,'2019-08-30 19:30:00','dasd','asdasd','t','a','','neutral');

/*!40000 ALTER TABLE `match` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table match_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `match_type`;

CREATE TABLE `match_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `match_type` WRITE;
/*!40000 ALTER TABLE `match_type` DISABLE KEYS */;

INSERT INTO `match_type` (`id`, `title`, `created_at`, `created_by`, `status`)
VALUES
	(1,'League Match','2017-09-13 12:51:39',2,1),
	(2,'Friendly Match','2017-09-13 12:51:44',2,1),
	(3,'League Cup','2017-09-13 12:51:49',2,1),
	(4,'County Cup','2017-09-13 12:51:52',2,1),
	(5,'Tournament','2017-09-13 12:51:55',2,1),
	(6,'Other','2017-09-13 12:52:03',2,1),
	(7,'Football Festival','2019-08-20 16:42:34',0,1),
	(8,'Transitional Game','2019-08-20 16:43:30',0,1);

/*!40000 ALTER TABLE `match_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `message`;

CREATE TABLE `message` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `reply_to` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`message_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`),
  KEY `topic_id` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;

INSERT INTO `message` (`message_id`, `franchise_id`, `topic_id`, `club_id`, `content`, `reply_to`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(1,146,1,107,'I think we should make the kids to press ups\n',NULL,'2019-07-19 11:18:22',424,'2019-07-19 11:18:22',NULL,1),
	(2,146,1,107,'Yes and jumps',NULL,'2019-07-19 11:29:38',426,'2019-07-19 11:29:38',NULL,1);

/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table notification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notification`;

CREATE TABLE `notification` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `player_id` int(11) DEFAULT NULL,
  `source_id` int(11) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `seen` tinyint(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `team_id` (`team_id`),
  KEY `player_id` (`player_id`),
  KEY `source_id` (`source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;

INSERT INTO `notification` (`id`, `user_id`, `team_id`, `player_id`, `source_id`, `type`, `time`, `seen`)
VALUES
	(655,420,NULL,NULL,420,'welcome','2019-07-05 11:34:29',0),
	(656,420,315,NULL,12,'programme','2019-07-05 13:00:26',0),
	(657,421,NULL,NULL,421,'welcome','2019-07-05 13:15:18',0),
	(658,421,NULL,NULL,421,'no-kids','2019-07-05 13:15:18',0),
	(659,418,NULL,216,216,'player','2019-07-05 13:24:03',1),
	(660,419,NULL,216,216,'player','2019-07-05 13:24:03',0),
	(661,421,315,216,54,'trial-session','2019-07-05 14:14:02',0),
	(662,421,315,216,87,'kit','2019-07-05 16:42:50',0),
	(663,421,315,216,88,'kit','2019-07-05 16:42:50',0),
	(664,421,315,216,89,'kit','2019-07-05 16:42:50',0),
	(665,421,315,216,90,'kit','2019-07-05 16:42:50',0),
	(666,421,315,216,216,'player-team','2019-07-05 16:42:50',0),
	(667,421,NULL,NULL,138,'feedback','2019-07-08 11:53:23',0),
	(668,422,NULL,NULL,422,'welcome','2019-07-08 11:56:54',0),
	(669,422,NULL,NULL,422,'no-kids','2019-07-08 11:56:54',0),
	(670,420,NULL,NULL,139,'feedback','2019-07-08 13:39:56',0),
	(671,421,NULL,NULL,140,'feedback','2019-07-08 13:47:01',0),
	(672,422,NULL,NULL,140,'feedback','2019-07-08 13:47:01',0),
	(673,418,NULL,217,217,'player','2019-07-08 15:42:31',1),
	(674,419,NULL,217,217,'player','2019-07-08 15:42:31',0),
	(675,422,315,217,53,'trial-session','2019-07-08 15:42:57',0),
	(676,422,315,217,87,'kit','2019-07-08 15:45:14',0),
	(677,422,315,217,88,'kit','2019-07-08 15:45:14',0),
	(678,422,315,217,89,'kit','2019-07-08 15:45:14',0),
	(679,422,315,217,90,'kit','2019-07-08 15:45:14',0),
	(680,422,315,217,217,'player-team','2019-07-08 15:45:14',0),
	(681,421,NULL,NULL,141,'feedback','2019-07-09 11:26:37',0),
	(682,422,NULL,NULL,141,'feedback','2019-07-09 11:26:37',0),
	(683,420,315,NULL,60,'event','2019-07-17 15:50:26',0),
	(684,421,315,216,60,'event','2019-07-17 15:50:26',0),
	(685,422,315,217,60,'event','2019-07-17 15:50:26',0),
	(686,418,NULL,NULL,1,'event-request','2019-07-17 17:04:10',1),
	(687,419,NULL,NULL,1,'event-request','2019-07-17 17:04:10',0),
	(688,421,NULL,NULL,1,'request-rejected','2019-07-18 15:42:12',0),
	(689,418,NULL,NULL,2,'event-request','2019-07-18 16:50:46',1),
	(690,419,NULL,NULL,2,'event-request','2019-07-18 16:50:46',0),
	(691,418,NULL,NULL,3,'event-request','2019-07-18 16:58:12',1),
	(692,419,NULL,NULL,3,'event-request','2019-07-18 16:58:12',0),
	(693,421,NULL,NULL,3,'request-rejected','2019-07-19 09:57:04',0),
	(694,421,NULL,NULL,3,'request-rejected','2019-07-19 10:03:28',0),
	(695,421,NULL,NULL,3,'request-rejected','2019-07-19 10:03:56',0),
	(696,421,NULL,NULL,3,'request-rejected','2019-07-19 10:05:03',0),
	(697,421,NULL,NULL,3,'request-rejected','2019-07-19 10:05:08',0),
	(698,426,NULL,NULL,426,'welcome','2019-07-19 10:16:16',0),
	(699,421,NULL,NULL,2,'request-rejected','2019-07-19 10:18:06',0),
	(700,421,NULL,NULL,2,'request-rejected','2019-07-19 10:19:07',0),
	(701,421,NULL,NULL,2,'request-rejected','2019-07-19 10:19:44',0),
	(702,421,NULL,NULL,2,'request-rejected','2019-07-19 10:20:17',0),
	(703,426,320,NULL,14,'programme','2019-07-19 10:55:18',0),
	(704,426,322,NULL,15,'programme','2019-07-19 10:55:18',0),
	(705,426,321,NULL,16,'programme','2019-07-19 10:55:18',0),
	(706,426,317,NULL,17,'programme','2019-07-19 10:57:40',0),
	(707,426,318,NULL,18,'programme','2019-07-19 10:57:40',0),
	(708,426,319,NULL,19,'programme','2019-07-19 10:57:40',0),
	(709,427,NULL,NULL,427,'welcome','2019-07-19 11:45:57',0),
	(710,426,NULL,NULL,142,'feedback','2019-07-19 11:51:39',0),
	(711,427,NULL,NULL,142,'feedback','2019-07-19 11:51:39',0),
	(712,428,NULL,NULL,428,'welcome','2019-07-19 12:01:01',0),
	(713,428,NULL,NULL,428,'no-kids','2019-07-19 12:01:01',0),
	(714,418,NULL,218,218,'player','2019-07-19 12:11:42',1),
	(715,419,NULL,218,218,'player','2019-07-19 12:11:42',0),
	(716,424,NULL,218,218,'player','2019-07-19 12:11:42',0),
	(717,425,NULL,218,218,'player','2019-07-19 12:11:42',0),
	(718,428,319,218,210,'trial-session','2019-07-19 12:13:10',0),
	(719,428,319,218,210,'trial-session','2019-07-19 12:14:38',0),
	(720,428,319,218,218,'player-team','2019-07-19 12:15:56',0),
	(721,428,319,218,218,'player-team','2019-07-19 12:16:51',0),
	(722,428,319,218,99,'kit','2019-07-19 12:22:32',0),
	(723,418,NULL,NULL,4,'event-request','2019-07-19 12:24:44',1),
	(724,419,NULL,NULL,4,'event-request','2019-07-19 12:24:44',0),
	(725,424,NULL,NULL,4,'event-request','2019-07-19 12:24:44',0),
	(726,425,NULL,NULL,4,'event-request','2019-07-19 12:24:44',0),
	(727,428,NULL,NULL,4,'request-rejected','2019-07-19 12:25:13',0),
	(728,429,NULL,NULL,429,'welcome','2019-07-19 15:29:23',0),
	(729,418,NULL,219,219,'player','2019-07-19 16:08:38',1),
	(730,419,NULL,219,219,'player','2019-07-19 16:08:38',0),
	(731,424,NULL,219,219,'player','2019-07-19 16:08:38',0),
	(732,425,NULL,219,219,'player','2019-07-19 16:08:38',0),
	(733,428,319,218,99,'kit','2019-07-19 16:13:11',0),
	(734,428,319,218,218,'player-team','2019-07-19 16:13:11',0),
	(735,427,319,NULL,20,'programme','2019-07-22 10:40:54',0),
	(736,428,319,218,20,'programme','2019-07-22 10:40:54',0),
	(737,426,318,NULL,21,'programme','2019-07-22 13:20:47',0),
	(738,426,319,NULL,22,'programme','2019-07-22 13:23:04',0),
	(739,428,319,218,22,'programme','2019-07-22 13:23:04',0),
	(740,428,324,218,218,'player-team','2019-07-31 14:39:56',0),
	(741,428,NULL,219,92,'kit','2019-07-31 15:53:16',0),
	(742,428,NULL,219,95,'kit','2019-07-31 15:53:16',0),
	(743,428,324,218,92,'kit','2019-07-31 15:54:06',0),
	(744,428,324,218,93,'kit','2019-07-31 15:54:06',0),
	(745,428,324,218,95,'kit','2019-07-31 15:54:06',0),
	(746,428,324,218,96,'kit','2019-07-31 15:54:06',0),
	(747,420,327,NULL,23,'programme','2019-08-14 11:48:05',0),
	(748,437,NULL,NULL,437,'welcome','2019-08-14 13:10:45',0),
	(749,420,327,NULL,1,'fixture','2019-08-19 09:42:12',0),
	(750,429,327,NULL,25,'programme','2019-08-19 12:08:30',0),
	(751,437,327,NULL,26,'programme','2019-08-19 12:12:56',0),
	(752,437,327,NULL,27,'programme','2019-08-19 12:14:08',0),
	(753,437,327,NULL,28,'programme','2019-08-19 12:16:35',0),
	(754,420,334,NULL,29,'programme','2019-08-20 15:22:16',0),
	(755,440,NULL,NULL,440,'welcome','2019-08-22 10:42:36',0),
	(756,440,NULL,NULL,440,'no-kids','2019-08-22 10:42:36',0),
	(757,441,NULL,NULL,441,'welcome','2019-08-22 10:47:28',0),
	(758,418,NULL,220,220,'player','2019-08-27 11:32:48',1),
	(759,419,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(760,424,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(761,425,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(762,432,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(763,433,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(764,436,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(765,439,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(766,443,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(767,444,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(768,445,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(769,446,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(770,447,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(771,448,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(772,449,NULL,220,220,'player','2019-08-27 11:32:48',0),
	(773,418,NULL,221,221,'player','2019-08-27 12:09:49',1),
	(774,419,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(775,424,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(776,425,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(777,432,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(778,433,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(779,436,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(780,439,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(781,443,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(782,444,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(783,445,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(784,446,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(785,447,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(786,448,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(787,449,NULL,221,221,'player','2019-08-27 12:09:49',0),
	(788,418,NULL,222,222,'player','2019-08-27 12:10:07',1),
	(789,419,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(790,424,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(791,425,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(792,432,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(793,433,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(794,436,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(795,439,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(796,443,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(797,444,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(798,445,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(799,446,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(800,447,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(801,448,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(802,449,NULL,222,222,'player','2019-08-27 12:10:07',0),
	(803,418,NULL,223,223,'player','2019-08-27 12:17:10',1),
	(804,419,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(805,424,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(806,425,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(807,432,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(808,433,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(809,436,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(810,439,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(811,443,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(812,444,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(813,445,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(814,446,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(815,447,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(816,448,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(817,449,NULL,223,223,'player','2019-08-27 12:17:10',0),
	(818,418,NULL,224,224,'player','2019-08-27 12:19:04',1),
	(819,419,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(820,424,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(821,425,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(822,432,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(823,433,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(824,436,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(825,439,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(826,443,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(827,444,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(828,445,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(829,446,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(830,447,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(831,448,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(832,449,NULL,224,224,'player','2019-08-27 12:19:04',0),
	(833,418,NULL,225,225,'player','2019-08-27 15:25:29',1),
	(834,419,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(835,424,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(836,425,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(837,432,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(838,433,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(839,436,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(840,439,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(841,443,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(842,444,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(843,445,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(844,446,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(845,447,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(846,448,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(847,449,NULL,225,225,'player','2019-08-27 15:25:29',0),
	(848,437,332,NULL,2,'fixture','2019-08-27 15:27:13',0);

/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table package
# ------------------------------------------------------------

DROP TABLE IF EXISTS `package`;

CREATE TABLE `package` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(8,2) NOT NULL,
  `max_slot` int(5) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `package` WRITE;
/*!40000 ALTER TABLE `package` DISABLE KEYS */;

INSERT INTO `package` (`id`, `title`, `image_url`, `description`, `price`, `max_slot`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(39,'FC Barcelona','','ur ideal Barcelona football package built for you. Enquire now to reserve your place for next season!',10.00,100,'2019-07-05 10:02:57',1,'2019-07-05 10:02:57',1,1),
	(40,'Atletico Madrid package','','Your ideal Atletico Madrid tickets package built for you. Enquire now or book securely online today!',15.00,200,'2019-07-05 10:04:13',1,'2019-07-05 10:04:13',1,1),
	(41,'Gold Package','','Great entry level package',25.00,100,'2019-07-19 09:45:44',1,'2019-07-19 09:45:44',1,1),
	(42,'Lakis Special ','','kghjgjh',55.00,250,'2019-07-31 17:53:49',1,'2019-07-31 17:53:49',1,1);

/*!40000 ALTER TABLE `package` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `page`;

CREATE TABLE `page` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table player
# ------------------------------------------------------------

DROP TABLE IF EXISTS `player`;

CREATE TABLE `player` (
  `player_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL DEFAULT '0',
  `living_guardian` int(11) NOT NULL,
  `billing_guardian` int(11) NOT NULL,
  `status` tinyint(4) DEFAULT '1',
  `first_name` varchar(50) DEFAULT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `gender` varchar(30) DEFAULT NULL,
  `birthday` timestamp NULL DEFAULT NULL,
  `school` varchar(255) DEFAULT NULL,
  `year_at_school` int(11) DEFAULT NULL,
  `medical_conditions` text,
  `note` text,
  `fan_no` varchar(10) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_injured` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`player_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;

INSERT INTO `player` (`player_id`, `franchise_id`, `club_id`, `living_guardian`, `billing_guardian`, `status`, `first_name`, `middle_name`, `last_name`, `display_name`, `gender`, `birthday`, `school`, `year_at_school`, `medical_conditions`, `note`, `fan_no`, `pic`, `created_by`, `updated_at`, `updated_by`, `created_at`, `is_injured`)
VALUES
	(216,145,105,421,421,1,'Jesse','Ellis','Lingardg','Jesse Lingardg','male','2005-10-14 01:00:00','Little stars',NULL,NULL,NULL,'10000','http://api2.grassroots.hostings.co.uk/storage/players/216/1562329443_Player-Profiles-Square-A-Pereira1558435513078.jpg',418,'2019-08-29 12:06:54',418,'2019-07-05 13:24:03',NULL),
	(217,145,105,422,422,1,'Harry',NULL,'Kane','Harry Kane','male','2014-07-09 01:00:00','Highgate',NULL,NULL,NULL,NULL,'http://api2.grassroots.hostings.co.uk/storage/players/217/1562596951_boy.jpg',422,'2019-07-08 15:42:31',0,'2019-07-08 15:42:31',NULL),
	(218,146,107,428,428,1,'Harry',NULL,'Kane','Harry Kane','male','2015-07-08 01:00:00','Highgate',NULL,'Had an ankle injury last year. He\'s perfect now. ',NULL,'9870979879','http://api2.grassroots.hostings.co.uk/storage/players/218/1563534702_harry.jpg',424,'2019-07-19 12:11:42',0,'2019-07-19 12:11:42',NULL),
	(219,146,107,428,428,1,'Tom',NULL,'Kane','Tom Kane','male','2015-07-02 01:00:00','Highgate',NULL,NULL,NULL,'8709879807','http://api2.grassroots.hostings.co.uk/storage/players/219/1563548918_boy.jpg',428,'2019-07-19 16:08:38',0,'2019-07-19 16:08:38',NULL),
	(220,145,105,422,422,1,'First name','Middle name','Last name','First name Last name','male','2008-08-08 01:00:00','Barking school',NULL,'Medical notes',NULL,'100','http://api2.grassroots.hostings.co.uk/storage/players/220/1566901968_Football-Acedemy-.jpg',418,'2019-08-27 11:32:48',0,'2019-08-27 11:32:48',NULL),
	(221,145,105,422,422,1,'Asdf','asdf','asdf','Asdf asdf','male','2005-08-20 01:00:00','School asdf',NULL,'Medical notess',NULL,'123','http://api2.grassroots.hostings.co.uk/storage/players/221/1566904189_Football-Acedemy-.jpg',418,'2019-08-28 12:19:47',418,'2019-08-27 12:09:49',NULL),
	(222,145,105,422,422,1,'Asdf','asdf','asdf','Asdf asdf','male','2005-08-20 01:00:00','School asdf',NULL,'Medical notes',NULL,'123','http://api2.grassroots.hostings.co.uk/storage/players/222/1566904207_Football-Acedemy-.jpg',418,'2019-08-27 12:10:07',0,'2019-08-27 12:10:07',NULL),
	(223,145,105,422,422,1,'Asdf','asdf','asdf','Asdf asdf','male','2000-07-15 01:00:00','asdf',NULL,'Medical notes',NULL,'132','http://api2.grassroots.hostings.co.uk/storage/players/223/1566904630_Football-Acedemy-.jpg',418,'2019-08-27 12:17:10',0,'2019-08-27 12:17:10',NULL),
	(224,145,105,422,422,1,'Will','Doe','Last name','Will Last name','male','2007-08-11 01:00:00','School asdf asdf',NULL,'Medical notes',NULL,'12','http://api2.grassroots.hostings.co.uk/storage/players/224/1566904744_Football-Acedemy-.jpg',418,'2019-08-27 12:19:04',0,'2019-08-27 12:19:04',NULL),
	(225,145,105,422,421,1,'Testing','testing','testing','Testing testing','male','2006-08-10 01:00:00','testing',NULL,NULL,NULL,'8',NULL,418,'2019-08-27 15:25:29',0,'2019-08-27 15:25:29',NULL);

/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table pod
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pod`;

CREATE TABLE `pod` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `team_id` (`team_id`),
  KEY `session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table pricelist
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pricelist`;

CREATE TABLE `pricelist` (
  `list_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `price2` decimal(8,2) NOT NULL,
  `price2plus` decimal(8,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`list_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table programme
# ------------------------------------------------------------

DROP TABLE IF EXISTS `programme`;

CREATE TABLE `programme` (
  `programme_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `type_id` int(11) DEFAULT NULL,
  `club_id` int(11) NOT NULL,
  `consent_id` int(11) DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `notes` text,
  `image_path` text,
  `image_type` varchar(20) DEFAULT NULL,
  `pitch_number` bigint(22) DEFAULT NULL,
  `pitch_info` varchar(100) DEFAULT NULL,
  `payment_note` text,
  `require_equipment` text,
  `terms_conditions` text,
  PRIMARY KEY (`programme_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`),
  KEY `type_id` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `programme` WRITE;
/*!40000 ALTER TABLE `programme` DISABLE KEYS */;

INSERT INTO `programme` (`programme_id`, `franchise_id`, `type_id`, `club_id`, `consent_id`, `status`, `title`, `notes`, `image_path`, `image_type`, `pitch_number`, `pitch_info`, `payment_note`, `require_equipment`, `terms_conditions`)
VALUES
	(12,145,9,105,0,NULL,'Holiday (Non-Residential)',' Traditional Half Term Holiday football coaching course for young players aged 6-12yrs','http://api2.grassroots.hostings.co.uk/storage/program/13/1562328025_Football-Acedemy-.jpg','jpg',NULL,NULL,NULL,NULL,NULL),
	(13,145,1,105,4,NULL,'dasd','asd asdfa sd','http://api2.grassroots.hostings.co.uk/storage/program/1/1563375026_ScreenShot2019-07-15at13.24.43.png','png',NULL,NULL,NULL,NULL,NULL),
	(14,146,6,107,0,NULL,'Mid-Week Training (Wednesdays)','Is compulsary for all under 10 teams. ','http://api2.grassroots.hostings.co.uk/storage/program/6/1563530117_Document1.pdf','pdf',NULL,NULL,NULL,NULL,NULL),
	(15,146,6,107,0,NULL,'Mid-Week Training (Wednesdays)','Is compulsary for all under 10 teams. ','http://api2.grassroots.hostings.co.uk/storage/program/6/1563530117_Document1.pdf','pdf',NULL,NULL,NULL,NULL,NULL),
	(16,146,6,107,0,NULL,'Mid-Week Training (Wednesdays)','Is compulsary for all under 10 teams. ','http://api2.grassroots.hostings.co.uk/storage/program/6/1563530117_Document1.pdf','pdf',NULL,NULL,NULL,NULL,NULL),
	(17,146,9,107,0,NULL,'Saturday Academy','Saturday school fun','http://api2.grassroots.hostings.co.uk/storage/program/9/1563530260_Document1.pdf','pdf',NULL,NULL,NULL,NULL,NULL),
	(18,146,9,107,0,NULL,'Saturday Academy','Saturday school fun','http://api2.grassroots.hostings.co.uk/storage/program/9/1563530260_Document1.pdf','pdf',NULL,NULL,NULL,NULL,NULL),
	(19,146,9,107,0,NULL,'Saturday Academy','Saturday school fun','http://api2.grassroots.hostings.co.uk/storage/program/9/1563530260_Document1.pdf','pdf',NULL,NULL,NULL,NULL,NULL),
	(20,146,9,107,3,NULL,'Programme 2','Programme note','http://api2.grassroots.hostings.co.uk/storage/program/9/1563788454_Football-Acedemy-.jpg','jpg',NULL,NULL,NULL,NULL,NULL),
	(21,146,13,107,3,NULL,'Programme 3','Some not form programme','http://api2.grassroots.hostings.co.uk/storage/program/13/1563798047_ScreenShot2019-07-16at14.59.26.png','png',NULL,NULL,NULL,NULL,NULL),
	(22,146,9,107,3,NULL,'Programme 4','Programme 4 notes','','',NULL,NULL,NULL,NULL,NULL),
	(23,145,2,105,4,NULL,'Bradshaw Programmes','Testing programme consent','','',NULL,NULL,NULL,NULL,NULL),
	(24,145,11,105,NULL,NULL,'Under 18s - Lions vs opposition',NULL,'http://api2.grassroots.hostings.co.uk/storage/fixture/11/1566204132_Football-Acedemy-.jpg','jpg',NULL,NULL,NULL,NULL,NULL),
	(25,145,6,105,4,NULL,'newclub2','note','http://api2.grassroots.hostings.co.uk/storage/program/6/1566212910_Football-Acedemy-.jpg','jpg',NULL,NULL,NULL,NULL,NULL),
	(26,145,6,105,4,NULL,'Archive People 2','NOte','http://api2.grassroots.hostings.co.uk/storage/program/6/1566213176_Football-Acedemy-.jpg','jpg',NULL,NULL,NULL,NULL,NULL),
	(27,145,6,105,4,NULL,'Archive People 2','NOte','http://api2.grassroots.hostings.co.uk/storage/program/6/1566213248_Football-Acedemy-.jpg','jpg',NULL,NULL,NULL,NULL,NULL),
	(28,145,6,105,4,1,'Archive People 2','NOte','http://api2.grassroots.hostings.co.uk/storage/program/6/1566213395_Football-Acedemy-.jpg','jpg',12,'4vs4','payment','wear',NULL),
	(29,145,10,105,4,1,'New programme','NOtes','','',1,'3vs3','Payment notes','What to bring',NULL),
	(30,145,11,105,NULL,NULL,'Under 15s - Test 6 vs t',NULL,'','',NULL,NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `programme` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table programme_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `programme_type`;

CREATE TABLE `programme_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('fc','academy','trial','event') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`type_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `programme_type` WRITE;
/*!40000 ALTER TABLE `programme_type` DISABLE KEYS */;

INSERT INTO `programme_type` (`type_id`, `franchise_id`, `title`, `type`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(1,0,'Birthday','event','2017-11-09 11:10:45',1,'2017-06-22 15:24:21',1,1),
	(2,0,'Team Tournament','fc','2017-11-09 11:10:45',1,'2017-06-22 15:25:00',1,1),
	(3,0,'Holiday Camp','event','2017-11-09 11:10:45',1,'2017-06-22 15:25:16',1,1),
	(4,0,'Presentation Night','event','2017-11-09 11:10:45',1,'2017-06-22 15:25:51',1,1),
	(6,0,'Team Training','fc','2017-11-09 11:10:45',1,'2017-06-22 15:28:04',1,1),
	(7,0,'Charity Event','event','2017-11-09 11:10:45',1,'2017-06-22 15:28:30',1,1),
	(8,0,'Club Fundraiser','event','2017-11-09 11:10:45',1,'2017-06-22 15:28:55',1,1),
	(9,0,'Soccer School','academy','2017-11-09 11:10:45',1,'2017-06-22 15:31:39',1,1),
	(10,0,'Football Club','academy','2017-11-09 11:10:45',1,'2017-06-22 15:32:52',1,1),
	(11,0,'Team Match','fc','2017-11-09 11:10:45',1,'2017-06-22 15:34:07',1,1),
	(13,0,'After School Club','academy','2017-11-09 11:08:31',1,'2017-11-09 11:08:24',1,1),
	(14,0,'Breakfast Club','academy','2017-11-09 11:08:55',1,'2017-11-09 11:08:48',1,1),
	(15,0,'Camp','academy','2017-11-09 11:09:23',1,'2017-11-09 11:08:48',1,1),
	(16,0,'Birthday','academy','2017-11-09 11:09:48',1,'2017-11-09 11:08:48',1,1),
	(17,0,'PE Lesson','academy','2017-11-09 11:09:58',1,'2017-11-09 11:08:48',1,1);

/*!40000 ALTER TABLE `programme_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table qualification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `qualification`;

CREATE TABLE `qualification` (
  `qualification_id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) NOT NULL,
  `franchise_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`qualification_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_agegroup_club
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_agegroup_club`;

CREATE TABLE `rel_agegroup_club` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agegroup_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `agegroup_id` (`agegroup_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_agegroup_club` WRITE;
/*!40000 ALTER TABLE `rel_agegroup_club` DISABLE KEYS */;

INSERT INTO `rel_agegroup_club` (`id`, `agegroup_id`, `club_id`, `created_by`, `created_at`, `updated_by`, `updated_at`)
VALUES
	(1558,1,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1559,2,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1560,3,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1561,4,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1562,5,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1563,6,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1564,7,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1565,8,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1566,9,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1567,10,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1568,11,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1569,12,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1570,13,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1571,14,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1572,15,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1573,16,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1574,17,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1575,18,105,417,'2019-07-05 10:55:59',417,'2019-07-05 10:55:59'),
	(1576,1,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1577,2,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1578,3,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1579,4,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1580,5,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1581,6,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1582,7,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1583,8,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1584,9,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1585,10,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1586,11,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1587,12,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1588,13,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1589,14,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1590,15,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1591,16,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1592,17,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1593,18,106,417,'2019-07-05 11:04:21',417,'2019-07-05 11:04:21'),
	(1594,1,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1595,2,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1596,3,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1597,4,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1598,5,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1599,6,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1600,7,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1601,8,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1602,9,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1603,10,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1604,11,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1605,12,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1606,13,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1607,14,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1608,15,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1609,16,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1610,17,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1611,18,107,423,'2019-07-19 09:54:32',423,'2019-07-19 09:54:32'),
	(1612,1,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1613,2,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1614,3,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1615,4,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1616,5,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1617,6,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1618,7,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1619,8,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1620,9,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1621,10,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1622,11,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1623,12,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1624,13,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1625,14,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1626,15,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1627,16,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1628,17,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1629,18,108,430,'2019-07-31 17:34:46',430,'2019-07-31 17:34:46'),
	(1630,1,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1631,2,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1632,3,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1633,4,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1634,5,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1635,6,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1636,7,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1637,8,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1638,9,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1639,10,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1640,11,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1641,12,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1642,13,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1643,14,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1644,15,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1645,16,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1646,17,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1647,18,109,2,'2019-07-31 18:07:39',2,'2019-07-31 18:07:39'),
	(1648,1,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1649,2,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1650,3,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1651,4,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1652,5,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1653,6,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1654,7,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1655,8,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1656,9,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1657,10,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1658,11,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1659,12,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1660,13,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1661,14,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1662,15,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1663,16,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1664,17,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1665,18,110,2,'2019-07-31 18:08:36',2,'2019-07-31 18:08:36'),
	(1666,1,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1667,2,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1668,3,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1669,4,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1670,5,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1671,6,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1672,7,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1673,8,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1674,9,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1675,10,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1676,11,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1677,12,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1678,13,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1679,14,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1680,15,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1681,16,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1682,17,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1683,18,111,417,'2019-08-14 09:55:29',417,'2019-08-14 09:55:29'),
	(1684,1,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1685,2,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1686,3,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1687,4,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1688,5,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1689,6,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1690,7,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1691,8,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1692,9,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1693,10,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1694,11,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1695,12,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1696,13,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1697,14,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1698,15,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1699,16,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1700,17,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1701,18,112,438,'2019-08-22 10:38:53',438,'2019-08-22 10:38:53'),
	(1702,1,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1703,2,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1704,3,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1705,4,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1706,5,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1707,6,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1708,7,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1709,8,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1710,9,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1711,10,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1712,11,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1713,12,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1714,13,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1715,14,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1716,15,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1717,16,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1718,17,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1719,18,113,442,'2019-08-23 11:25:25',442,'2019-08-23 11:25:25'),
	(1720,1,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1721,2,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1722,3,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1723,4,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1724,5,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1725,6,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1726,7,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1727,8,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1728,9,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1729,10,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1730,11,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1731,12,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1732,13,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1733,14,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1734,15,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1735,16,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1736,17,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1737,18,114,438,'2019-08-23 15:44:36',438,'2019-08-23 15:44:36'),
	(1738,1,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1739,2,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1740,3,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1741,4,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1742,5,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1743,6,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1744,7,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1745,8,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1746,9,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1747,10,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1748,11,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1749,12,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1750,13,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1751,14,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1752,15,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1753,16,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1754,17,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1755,18,115,438,'2019-08-23 15:49:49',438,'2019-08-23 15:49:49'),
	(1756,1,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1757,2,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1758,3,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1759,4,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1760,5,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1761,6,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1762,7,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1763,8,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1764,9,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1765,10,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1766,11,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1767,12,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1768,13,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1769,14,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1770,15,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1771,16,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1772,17,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1773,18,116,438,'2019-08-23 15:50:36',438,'2019-08-23 15:50:36'),
	(1774,1,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1775,2,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1776,3,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1777,4,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1778,5,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1779,6,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1780,7,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1781,8,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1782,9,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1783,10,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1784,11,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1785,12,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1786,13,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1787,14,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1788,15,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1789,16,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1790,17,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1791,18,117,438,'2019-08-23 15:51:30',438,'2019-08-23 15:51:30'),
	(1792,1,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1793,2,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1794,3,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1795,4,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1796,5,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1797,6,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1798,7,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1799,8,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1800,9,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1801,10,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1802,11,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1803,12,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1804,13,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1805,14,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1806,15,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1807,16,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1808,17,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1809,18,118,438,'2019-08-23 16:02:14',438,'2019-08-23 16:02:14'),
	(1810,1,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1811,2,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1812,3,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1813,4,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1814,5,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1815,6,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1816,7,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1817,8,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1818,9,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1819,10,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1820,11,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1821,12,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1822,13,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1823,14,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1824,15,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1825,16,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1826,17,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18'),
	(1827,18,119,438,'2019-08-23 16:06:18',438,'2019-08-23 16:06:18');

/*!40000 ALTER TABLE `rel_agegroup_club` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_assessment_qa
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_assessment_qa`;

CREATE TABLE `rel_assessment_qa` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  KEY `answer_id` (`answer_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_assessment_qa` WRITE;
/*!40000 ALTER TABLE `rel_assessment_qa` DISABLE KEYS */;

INSERT INTO `rel_assessment_qa` (`answer_id`, `question_id`)
VALUES
	(148,72),
	(149,73),
	(150,74),
	(154,72),
	(155,73),
	(156,74),
	(157,80),
	(158,81),
	(159,82),
	(160,83),
	(169,80),
	(170,81),
	(171,82),
	(172,83);

/*!40000 ALTER TABLE `rel_assessment_qa` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_assessment_question
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_assessment_question`;

CREATE TABLE `rel_assessment_question` (
  `assessment_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  KEY `assessment_id` (`assessment_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_assessment_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_assessment_user`;

CREATE TABLE `rel_assessment_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assessment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` tinyint(4) DEFAULT '0' COMMENT '0:pending; 1:completed; 2:partialy completed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assessment_id` (`assessment_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_assessment_user` WRITE;
/*!40000 ALTER TABLE `rel_assessment_user` DISABLE KEYS */;

INSERT INTO `rel_assessment_user` (`id`, `assessment_id`, `user_id`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`)
VALUES
	(47,8,420,1,'2019-07-08 11:50:34',418,'2019-07-08 11:50:40',418),
	(48,8,420,1,'2019-07-08 15:31:35',418,'2019-07-08 15:31:41',418),
	(49,12,426,1,'2019-07-19 10:43:27',424,'2019-07-19 10:43:27',424),
	(50,12,426,1,'2019-07-19 10:43:42',424,'2019-07-19 10:44:36',424);

/*!40000 ALTER TABLE `rel_assessment_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_award_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_award_user`;

CREATE TABLE `rel_award_user` (
  `award_id` int(11) NOT NULL,
  `user_player_id` int(11) NOT NULL,
  `is_player_assigment` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  KEY `award_id` (`award_id`),
  KEY `user_player_id` (`user_player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_checklist_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_checklist_user`;

CREATE TABLE `rel_checklist_user` (
  `checklist_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  KEY `checklist_id` (`checklist_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_checklistitem_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_checklistitem_user`;

CREATE TABLE `rel_checklistitem_user` (
  `item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_completed` tinyint(4) DEFAULT '0',
  `completed_at` time DEFAULT NULL,
  KEY `item_id` (`item_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_club_package
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_club_package`;

CREATE TABLE `rel_club_package` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `package_id` int(11) NOT NULL,
  `club_id` int(11) DEFAULT '0',
  `franchise_id` int(11) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expire_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(8,2) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(2) NOT NULL,
  `completed_status` tinyint(4) NOT NULL DEFAULT '2' COMMENT '1:partialy completed; 2:not completed; 3:completed',
  `super_admin_status` int(11) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `package_id` (`package_id`),
  KEY `franchise_id` (`franchise_id`),
  CONSTRAINT `package_id` FOREIGN KEY (`package_id`) REFERENCES `package` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_club_package` WRITE;
/*!40000 ALTER TABLE `rel_club_package` DISABLE KEYS */;

INSERT INTO `rel_club_package` (`id`, `package_id`, `club_id`, `franchise_id`, `start_date`, `expire_date`, `amount`, `created_by`, `created_at`, `updated_by`, `updated_at`, `status`, `completed_status`, `super_admin_status`)
VALUES
	(331,39,106,145,'2019-07-05 10:50:14','2019-09-05 12:50:14',10.00,417,'2019-07-05 10:50:14',417,'2019-08-04 12:52:01',1,2,1),
	(332,40,105,145,'2019-07-05 10:50:26','2019-09-05 12:50:26',15.00,417,'2019-07-05 10:50:26',417,'2019-08-04 12:52:01',1,2,1),
	(333,41,107,146,'2019-07-19 09:47:07','2019-09-19 09:47:07',25.00,423,'2019-07-19 09:47:07',423,'2019-08-18 09:48:02',1,2,1),
	(334,41,110,4,'2019-07-31 14:13:29','2019-08-31 14:13:29',25.00,2,'2019-07-31 14:13:29',2,'2019-07-31 18:57:11',1,2,1),
	(335,41,108,147,'2019-07-31 17:27:54','2019-08-31 17:27:54',25.00,430,'2019-07-31 17:27:54',430,'2019-07-31 17:52:37',1,2,1),
	(336,41,0,148,'2019-07-31 17:28:28','2019-08-31 17:28:28',25.00,431,'2019-07-31 17:28:28',431,'2019-07-31 17:28:28',1,2,1),
	(337,41,0,147,'2019-07-31 17:30:20','2019-08-31 17:30:20',25.00,430,'2019-07-31 17:30:20',430,'2019-07-31 17:30:20',1,2,1),
	(338,39,111,145,'2019-08-14 09:53:51','2019-09-14 09:53:51',10.00,417,'2019-08-14 09:53:51',417,'2019-08-14 09:55:29',1,2,1),
	(339,39,0,145,'2019-08-14 09:55:51','2019-09-14 09:55:51',10.00,417,'2019-08-14 09:55:51',417,'2019-08-14 09:55:51',1,2,1),
	(340,42,112,149,'2019-08-22 10:32:14','2019-09-22 10:32:14',55.00,438,'2019-08-22 10:32:14',438,'2019-08-22 10:38:53',1,2,1),
	(341,39,113,150,'2019-08-23 11:17:15','2019-09-23 11:17:15',10.00,442,'2019-08-23 11:17:15',442,'2019-08-23 11:25:25',1,2,1),
	(342,40,114,149,'2019-08-23 15:43:35','2019-09-23 15:43:35',15.00,438,'2019-08-23 15:43:35',438,'2019-08-23 15:44:35',1,2,1),
	(343,39,115,149,'2019-08-23 15:49:24','2019-09-23 15:49:24',10.00,438,'2019-08-23 15:49:24',438,'2019-08-23 15:49:49',1,2,1),
	(344,39,116,149,'2019-08-23 15:50:29','2019-09-23 15:50:29',10.00,438,'2019-08-23 15:50:29',438,'2019-08-23 15:50:36',1,2,1),
	(345,39,117,149,'2019-08-23 15:51:16','2019-09-23 15:51:16',10.00,438,'2019-08-23 15:51:16',438,'2019-08-23 15:51:30',1,2,1),
	(346,41,118,149,'2019-08-23 15:59:12','2019-09-23 15:59:12',25.00,438,'2019-08-23 15:59:12',438,'2019-08-23 16:02:14',1,2,1),
	(347,42,119,149,'2019-08-23 16:06:07','2019-09-23 16:06:07',55.00,438,'2019-08-23 16:06:07',438,'2019-08-23 16:06:18',1,2,1);

/*!40000 ALTER TABLE `rel_club_package` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_club_skill
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_club_skill`;

CREATE TABLE `rel_club_skill` (
  `club_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`club_id`),
  KEY `skill_id` (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_coach_session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_coach_session`;

CREATE TABLE `rel_coach_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` tinyint(2) DEFAULT '0',
  `coach_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `coach_id` (`coach_id`),
  KEY `session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='status: \n0 attendant pending\n1 coach attendant';

LOCK TABLES `rel_coach_session` WRITE;
/*!40000 ALTER TABLE `rel_coach_session` DISABLE KEYS */;

INSERT INTO `rel_coach_session` (`id`, `status`, `coach_id`, `session_id`, `price`, `created_at`, `created_by`, `updated_at`, `updated_by`)
VALUES
	(52,0,420,52,20.00,'2019-07-05 13:00:25',418,'2019-07-05 13:00:25',418),
	(53,0,420,53,20.00,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26',418),
	(54,0,420,54,20.00,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26',418),
	(55,0,420,55,20.00,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26',418),
	(56,0,420,56,20.00,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26',418),
	(58,0,420,58,20.00,'2019-07-17 15:50:26',418,'2019-07-17 15:50:26',418),
	(59,0,420,59,20.00,'2019-07-17 15:50:26',418,'2019-07-17 15:50:26',418),
	(60,0,420,60,20.00,'2019-07-17 15:50:26',418,'2019-07-17 15:50:26',418),
	(61,0,426,61,10.00,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424),
	(62,0,426,62,10.00,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424),
	(63,0,426,63,10.00,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424),
	(64,0,426,64,10.00,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424),
	(65,0,426,65,10.00,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424),
	(66,0,426,66,10.00,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424),
	(67,0,426,67,10.00,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424),
	(68,0,426,68,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(69,0,426,69,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(70,0,426,70,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(71,0,426,71,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(72,0,426,72,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(73,0,426,73,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(74,0,426,74,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(75,0,426,75,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(76,0,426,76,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(77,0,426,77,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(78,0,426,78,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(79,0,426,79,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(80,0,426,80,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(81,0,426,81,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(82,0,426,82,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(83,0,426,83,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(84,0,426,84,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(85,0,426,85,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(86,0,426,86,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(87,0,426,87,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(88,0,426,88,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(89,0,426,89,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(90,0,426,90,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(91,0,426,91,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(92,0,426,92,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(93,0,426,93,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(94,0,426,94,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(95,0,426,95,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(96,0,426,96,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(97,0,426,97,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(98,0,426,98,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(99,0,426,99,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(100,0,426,100,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(101,0,426,101,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(102,0,426,102,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(103,0,426,103,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(104,0,426,104,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(105,0,426,105,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(106,0,426,106,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(107,0,426,107,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(108,0,426,108,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(109,0,426,109,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(110,0,426,110,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(111,0,426,111,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(112,0,426,112,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(113,0,426,113,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(114,0,426,114,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(115,0,426,115,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(116,0,426,116,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(117,0,426,117,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(118,0,426,118,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(119,0,426,119,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(120,0,426,120,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(121,0,426,121,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(122,0,426,122,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(123,0,426,123,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(124,0,426,124,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(125,0,426,125,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(126,0,426,126,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(127,0,426,127,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(128,0,426,128,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(129,0,426,129,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(130,0,426,130,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(131,0,426,131,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(132,0,426,132,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(133,0,426,133,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(134,0,426,134,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(135,0,426,135,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(136,0,426,136,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(137,0,426,137,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(138,0,426,138,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(139,0,426,139,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(140,0,426,140,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(141,0,426,141,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(142,0,426,142,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(143,0,426,143,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(144,0,426,144,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(145,0,426,145,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(146,0,426,146,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(147,0,426,147,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(148,0,426,148,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(149,0,426,149,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(150,0,426,150,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(151,0,426,151,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(152,0,426,152,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(153,0,426,153,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(154,0,426,154,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(155,0,426,155,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(156,0,426,156,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(157,0,426,157,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(158,0,426,158,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(159,0,426,159,10.00,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424),
	(161,0,426,161,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(163,0,426,163,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(164,0,426,164,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(165,0,426,165,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(166,0,426,166,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(167,0,426,167,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(168,0,426,168,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(169,0,426,169,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(170,0,426,170,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(171,0,426,171,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(172,0,426,172,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(173,0,426,173,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(174,0,426,174,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(175,0,426,175,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(176,0,426,176,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(177,0,426,177,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(178,0,426,178,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(179,0,426,179,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(180,0,426,180,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(181,0,426,181,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(182,0,426,182,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(183,0,426,183,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(184,0,426,184,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(186,0,426,186,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(187,0,426,187,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(188,0,426,188,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(189,0,426,189,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(190,0,426,190,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(191,0,426,191,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(192,0,426,192,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(193,0,426,193,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(194,0,426,194,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(195,0,426,195,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(196,0,426,196,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(197,0,426,197,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(198,0,426,198,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(199,0,426,199,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(200,0,426,200,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(201,0,426,201,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(202,0,426,202,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(203,0,426,203,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(204,0,426,204,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(205,0,426,205,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(206,0,426,206,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(207,0,426,207,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(208,0,426,208,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(209,0,426,209,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(211,0,426,211,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(213,0,426,213,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(214,0,426,214,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(215,0,426,215,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(216,0,426,216,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(217,0,426,217,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(218,0,426,218,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(219,0,426,219,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(220,0,426,220,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(221,0,426,221,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(222,0,426,222,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(223,0,426,223,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(224,0,426,224,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(225,0,426,225,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(226,0,426,226,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(227,0,426,227,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(228,0,426,228,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(229,0,426,229,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(230,0,426,230,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(231,0,426,231,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(232,0,426,232,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(233,0,426,233,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(234,0,426,234,10.00,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424),
	(235,0,427,212,21.00,'2019-07-19 11:46:07',424,'2019-07-19 11:46:07',424),
	(237,0,427,160,21.00,'2019-07-19 16:01:32',424,'2019-07-19 16:01:32',424),
	(238,0,427,162,21.00,'2019-07-19 16:01:45',424,'2019-07-19 16:01:45',424),
	(239,0,427,185,21.00,'2019-07-19 16:02:19',424,'2019-07-19 16:02:19',424),
	(240,0,426,210,10.00,'2019-07-19 16:03:44',424,'2019-07-19 16:03:44',424),
	(241,0,427,235,21.00,'2019-07-22 10:40:54',425,'2019-07-22 10:40:54',425),
	(242,0,427,236,21.00,'2019-07-22 10:40:54',425,'2019-07-22 10:40:54',425),
	(243,0,426,237,10.00,'2019-07-22 13:20:47',425,'2019-07-22 13:20:47',425),
	(244,0,426,238,10.00,'2019-07-22 13:20:47',425,'2019-07-22 13:20:47',425),
	(245,0,426,239,10.00,'2019-07-22 13:23:04',425,'2019-07-22 13:23:04',425),
	(246,0,426,240,10.00,'2019-07-22 13:23:04',425,'2019-07-22 13:23:04',425),
	(247,0,429,57,11.00,'2019-07-22 16:08:01',418,'2019-07-22 16:08:01',418),
	(248,0,420,241,20.00,'2019-08-14 11:48:05',418,'2019-08-14 11:48:05',418),
	(249,0,420,242,20.00,'2019-08-14 11:48:05',418,'2019-08-14 11:48:05',418),
	(250,0,420,243,20.00,'2019-08-19 09:42:12',418,'2019-08-19 09:42:12',418),
	(251,0,429,244,11.00,'2019-08-19 12:08:30',418,'2019-08-19 12:08:30',418),
	(252,0,429,245,11.00,'2019-08-19 12:08:30',418,'2019-08-19 12:08:30',418),
	(253,0,437,246,15.00,'2019-08-19 12:12:56',418,'2019-08-19 12:12:56',418),
	(254,0,437,247,15.00,'2019-08-19 12:12:56',418,'2019-08-19 12:12:56',418),
	(255,0,437,248,15.00,'2019-08-19 12:14:08',418,'2019-08-19 12:14:08',418),
	(256,0,437,249,15.00,'2019-08-19 12:14:08',418,'2019-08-19 12:14:08',418),
	(257,0,437,250,15.00,'2019-08-19 12:16:35',418,'2019-08-19 12:16:35',418),
	(258,0,437,251,15.00,'2019-08-19 12:16:35',418,'2019-08-19 12:16:35',418),
	(259,0,420,252,20.00,'2019-08-20 15:22:15',418,'2019-08-20 15:22:15',418),
	(260,0,420,253,20.00,'2019-08-20 15:22:16',418,'2019-08-20 15:22:16',418),
	(262,0,429,254,11.00,'2019-08-29 11:54:24',418,'2019-08-29 11:54:24',418);

/*!40000 ALTER TABLE `rel_coach_session` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_coach_team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_coach_team`;

CREATE TABLE `rel_coach_team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coach_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `coach_id` (`coach_id`),
  KEY `team_id` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_coach_team` WRITE;
/*!40000 ALTER TABLE `rel_coach_team` DISABLE KEYS */;

INSERT INTO `rel_coach_team` (`id`, `coach_id`, `team_id`)
VALUES
	(358,420,315),
	(359,426,317),
	(360,426,318),
	(361,426,319),
	(362,427,320),
	(363,427,321),
	(364,429,315),
	(365,429,316);

/*!40000 ALTER TABLE `rel_coach_team` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_consent_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_consent_user`;

CREATE TABLE `rel_consent_user` (
  `consent_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `agreed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `consent_id` (`consent_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_fee_player
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_fee_player`;

CREATE TABLE `rel_fee_player` (
  `fee_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `expire_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  KEY `fee_id` (`fee_id`),
  KEY `player_id` (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_feedback_qa
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_feedback_qa`;

CREATE TABLE `rel_feedback_qa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `answer_id` (`answer_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_feedback_qa` WRITE;
/*!40000 ALTER TABLE `rel_feedback_qa` DISABLE KEYS */;

INSERT INTO `rel_feedback_qa` (`id`, `answer_id`, `question_id`)
VALUES
	(100,102,215),
	(101,103,216),
	(102,104,217),
	(103,105,220),
	(104,106,221),
	(105,107,220),
	(106,108,221),
	(107,109,222),
	(108,110,223),
	(109,111,224),
	(110,112,225),
	(111,113,224),
	(112,114,225);

/*!40000 ALTER TABLE `rel_feedback_qa` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_feedback_question
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_feedback_question`;

CREATE TABLE `rel_feedback_question` (
  `feedback_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  KEY `feedback_id` (`feedback_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_feedback_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_feedback_user`;

CREATE TABLE `rel_feedback_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feedback_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `player_id` int(11) DEFAULT '0',
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feedback_id` (`feedback_id`),
  KEY `user_id` (`user_id`),
  KEY `player_id` (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_feedback_user` WRITE;
/*!40000 ALTER TABLE `rel_feedback_user` DISABLE KEYS */;

INSERT INTO `rel_feedback_user` (`id`, `feedback_id`, `user_id`, `player_id`, `status`)
VALUES
	(261,138,421,0,1),
	(262,139,420,0,0),
	(263,140,421,0,1),
	(264,140,422,0,1),
	(265,141,421,0,1),
	(266,141,422,0,0),
	(267,142,426,0,1),
	(268,142,427,0,1);

/*!40000 ALTER TABLE `rel_feedback_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_kit_team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_kit_team`;

CREATE TABLE `rel_kit_team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kit_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  KEY `kit_id` (`kit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_kit_team` WRITE;
/*!40000 ALTER TABLE `rel_kit_team` DISABLE KEYS */;

INSERT INTO `rel_kit_team` (`id`, `kit_id`, `team_id`)
VALUES
	(139,92,317),
	(140,94,317),
	(141,96,317),
	(142,94,318),
	(143,93,318),
	(144,95,318),
	(145,99,319),
	(146,95,321),
	(147,93,321),
	(148,95,322),
	(149,93,322),
	(150,92,320),
	(151,94,320),
	(152,93,323),
	(153,96,323),
	(154,99,323),
	(155,92,324),
	(156,93,324),
	(157,95,324),
	(158,96,324),
	(159,91,316),
	(161,87,315),
	(162,88,315),
	(163,89,315),
	(164,90,315),
	(165,91,315),
	(168,91,331);

/*!40000 ALTER TABLE `rel_kit_team` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_kit_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_kit_user`;

CREATE TABLE `rel_kit_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kit_id` int(11) NOT NULL,
  `user_player_id` int(11) NOT NULL,
  `user_role` enum('coach','guardian','player') NOT NULL DEFAULT 'player',
  `size` varchar(10) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `kit_id` (`kit_id`),
  KEY `user_player_id` (`user_player_id`),
  KEY `user_role` (`user_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_kititem_size
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_kititem_size`;

CREATE TABLE `rel_kititem_size` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kit_id` int(11) NOT NULL,
  `size` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kit_id` (`kit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_kititem_size` WRITE;
/*!40000 ALTER TABLE `rel_kititem_size` DISABLE KEYS */;

INSERT INTO `rel_kititem_size` (`id`, `kit_id`, `size`)
VALUES
	(393,87,'xxs'),
	(394,87,'xs'),
	(395,87,'s'),
	(396,87,'m'),
	(397,87,'l'),
	(398,87,'xl'),
	(399,87,'xxl'),
	(400,88,'xs'),
	(401,88,'xxs'),
	(402,88,'s'),
	(403,88,'m'),
	(404,88,'l'),
	(405,88,'xl'),
	(406,88,'xxl'),
	(407,89,'xs'),
	(408,89,'s'),
	(409,89,'m'),
	(410,89,'l'),
	(411,89,'xl'),
	(412,89,'xxl'),
	(413,90,'xxs'),
	(414,90,'xs'),
	(415,90,'s'),
	(416,90,'m'),
	(417,90,'l'),
	(418,90,'xl'),
	(419,91,'size8'),
	(420,91,'size5'),
	(421,91,'xxs'),
	(422,91,'l'),
	(423,91,'size10'),
	(424,92,'s'),
	(425,92,'m'),
	(426,92,'l'),
	(427,92,'xl'),
	(428,93,'s'),
	(429,93,'l'),
	(430,93,'m'),
	(431,93,'xl'),
	(432,94,'s'),
	(433,94,'m'),
	(434,94,'l'),
	(435,94,'xl'),
	(436,95,'s'),
	(437,95,'m'),
	(438,95,'l'),
	(439,95,'xl'),
	(440,96,'m'),
	(441,96,'s'),
	(442,96,'l'),
	(443,96,'xl'),
	(444,97,'s'),
	(445,97,'m'),
	(446,97,'l'),
	(447,97,'xl'),
	(448,98,'s'),
	(449,98,'m'),
	(450,98,'l'),
	(451,98,'xl'),
	(452,99,'s'),
	(453,99,'m'),
	(454,99,'l');

/*!40000 ALTER TABLE `rel_kititem_size` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_player_guardian
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_player_guardian`;

CREATE TABLE `rel_player_guardian` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `guardian_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `guardian_id` (`guardian_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_player_guardian` WRITE;
/*!40000 ALTER TABLE `rel_player_guardian` DISABLE KEYS */;

INSERT INTO `rel_player_guardian` (`id`, `player_id`, `guardian_id`)
VALUES
	(337,217,422),
	(338,218,428),
	(339,219,428),
	(340,220,422),
	(342,222,422),
	(343,223,422),
	(344,224,422),
	(345,225,422),
	(346,221,422),
	(349,216,421);

/*!40000 ALTER TABLE `rel_player_guardian` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_player_session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_player_session`;

CREATE TABLE `rel_player_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `reason` text NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `attendance_completed` tinyint(2) NOT NULL,
  `is_trial` tinyint(1) NOT NULL DEFAULT '0',
  `is_attended` tinyint(1) NOT NULL DEFAULT '0',
  `price` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_player_session` WRITE;
/*!40000 ALTER TABLE `rel_player_session` DISABLE KEYS */;

INSERT INTO `rel_player_session` (`id`, `player_id`, `session_id`, `status`, `reason`, `rating`, `created_at`, `created_by`, `updated_at`, `updated_by`, `attendance_completed`, `is_trial`, `is_attended`, `price`)
VALUES
	(64,217,53,1,'',NULL,'2019-07-08 15:42:57',418,'2019-07-08 15:45:04',418,0,1,0,NULL),
	(65,217,53,1,'',NULL,'2019-07-08 15:45:25',422,'2019-07-08 15:45:25',422,0,0,0,12.00),
	(66,217,55,1,'',NULL,'2019-07-08 15:45:25',422,'2019-07-08 15:45:25',422,0,0,0,12.00),
	(67,217,56,1,'',NULL,'2019-07-08 15:45:25',422,'2019-07-08 15:45:25',422,0,0,0,12.00),
	(68,218,235,1,'',NULL,'2019-07-22 12:54:23',428,'2019-07-22 12:54:23',428,0,0,0,10.00),
	(69,218,236,1,'',NULL,'2019-07-22 12:54:23',428,'2019-07-22 12:54:23',428,0,0,0,10.00),
	(70,218,239,1,'',NULL,'2019-07-22 13:23:54',428,'2019-07-22 13:23:54',428,0,0,0,10.00),
	(71,218,240,1,'',NULL,'2019-07-22 13:23:54',428,'2019-07-22 13:23:54',428,0,0,0,10.00);

/*!40000 ALTER TABLE `rel_player_session` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_player_team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_player_team`;

CREATE TABLE `rel_player_team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `player_session_id` int(11) DEFAULT NULL,
  `status` enum('assigned','waiting','trialist','trial','pending_parent_approval') NOT NULL DEFAULT 'trial',
  `reason` varchar(255) DEFAULT NULL,
  `trial_rating` int(2) NOT NULL,
  `date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `team_id` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_player_team` WRITE;
/*!40000 ALTER TABLE `rel_player_team` DISABLE KEYS */;

INSERT INTO `rel_player_team` (`id`, `player_id`, `team_id`, `player_session_id`, `status`, `reason`, `trial_rating`, `date`)
VALUES
	(31,216,315,59,'trialist',NULL,0,'2019-08-23 16:39:34'),
	(32,217,315,64,'trial','',0,'2019-08-23 16:36:40'),
	(33,218,319,69,'assigned','',0,'2019-07-19 16:13:11'),
	(34,218,324,NULL,'assigned',NULL,0,NULL),
	(35,219,323,NULL,'trial','',0,NULL),
	(36,217,329,NULL,'trial','',0,NULL),
	(37,220,330,NULL,'trial','',0,NULL),
	(38,221,330,NULL,'trial','',0,NULL),
	(39,222,330,NULL,'trial','',0,NULL),
	(40,223,335,NULL,'trial','',0,NULL),
	(41,224,330,NULL,'trial','',0,NULL),
	(42,224,329,NULL,'trial','',0,NULL);

/*!40000 ALTER TABLE `rel_player_team` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_programme_player
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_programme_player`;

CREATE TABLE `rel_programme_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `programme_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `consent_agreed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `programme_id` (`programme_id`),
  KEY `player_id` (`player_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_programme_player` WRITE;
/*!40000 ALTER TABLE `rel_programme_player` DISABLE KEYS */;

INSERT INTO `rel_programme_player` (`id`, `programme_id`, `player_id`, `status`, `consent_agreed_at`)
VALUES
	(24,12,217,1,NULL),
	(26,13,217,0,NULL),
	(29,19,218,0,NULL),
	(30,20,218,1,NULL),
	(31,22,218,1,'2019-07-22 13:23:54');

/*!40000 ALTER TABLE `rel_programme_player` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_programme_team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_programme_team`;

CREATE TABLE `rel_programme_team` (
  `programme_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  KEY `programme_id` (`programme_id`),
  KEY `team_id` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_programme_team` WRITE;
/*!40000 ALTER TABLE `rel_programme_team` DISABLE KEYS */;

INSERT INTO `rel_programme_team` (`programme_id`, `team_id`)
VALUES
	(12,315),
	(13,315),
	(14,320),
	(15,322),
	(16,321),
	(17,317),
	(18,318),
	(19,319),
	(20,319),
	(21,318),
	(22,319),
	(23,327),
	(24,327),
	(25,327),
	(26,327),
	(27,327),
	(28,327),
	(29,334),
	(30,332);

/*!40000 ALTER TABLE `rel_programme_team` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_qualification_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_qualification_user`;

CREATE TABLE `rel_qualification_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qualification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `expiration_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `qualification_id` (`qualification_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rel_skillgroup_team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_skillgroup_team`;

CREATE TABLE `rel_skillgroup_team` (
  `team_id` int(11) DEFAULT NULL,
  `skillgroup_id` int(11) DEFAULT NULL,
  KEY `team_id` (`team_id`),
  KEY `skillgroup_id` (`skillgroup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_skillgroup_team` WRITE;
/*!40000 ALTER TABLE `rel_skillgroup_team` DISABLE KEYS */;

INSERT INTO `rel_skillgroup_team` (`team_id`, `skillgroup_id`)
VALUES
	(320,317),
	(321,318),
	(322,319),
	(322,318),
	(330,328),
	(335,333);

/*!40000 ALTER TABLE `rel_skillgroup_team` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_sponsor_team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_sponsor_team`;

CREATE TABLE `rel_sponsor_team` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sponsor_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sponsor_id` (`sponsor_id`),
  KEY `team_id` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `rel_sponsor_team` WRITE;
/*!40000 ALTER TABLE `rel_sponsor_team` DISABLE KEYS */;

INSERT INTO `rel_sponsor_team` (`id`, `sponsor_id`, `team_id`)
VALUES
	(1,1,320),
	(2,2,321),
	(3,1,322),
	(4,2,324),
	(8,0,327);

/*!40000 ALTER TABLE `rel_sponsor_team` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table rel_tc_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rel_tc_user`;

CREATE TABLE `rel_tc_user` (
  `tc_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `agreed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tc_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;

INSERT INTO `role` (`role_id`, `title`, `created_at`, `created_by`, `status`)
VALUES
	(1,'admin','2017-02-08 15:31:29',1,1),
	(2,'coach','2017-02-06 12:49:47',1,1),
	(3,'guardian','2017-02-09 16:22:33',1,1),
	(4,'groupadmin','2019-04-25 16:45:48',1,1),
	(5,'superadmin','2019-04-25 16:45:40',1,1);

/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table scan
# ------------------------------------------------------------

DROP TABLE IF EXISTS `scan`;

CREATE TABLE `scan` (
  `scan_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `type_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expire` timestamp NULL DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`scan_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `scan` WRITE;
/*!40000 ALTER TABLE `scan` DISABLE KEYS */;

INSERT INTO `scan` (`scan_id`, `user_id`, `title`, `file_url`, `type_id`, `created_at`, `expire`, `status`)
VALUES
	(225,420,'CRB Scan','http://api2.grassroots.hostings.co.uk/storage/crb/420/1562322869_sample.pdf',1,'2019-07-05 11:34:29','2019-07-27 01:00:00',1),
	(226,420,'Safeguarding Children Scan','http://api2.grassroots.hostings.co.uk/storage/sc/420/1562322869_sample.pdf',2,'2019-07-05 11:34:29','2019-07-28 01:00:00',1),
	(227,420,'FA Level 1 Scan','',3,'2019-07-05 11:34:29',NULL,1),
	(228,420,'FA Level 2 Scan','',3,'2019-07-05 11:34:29',NULL,1),
	(229,420,'Emergency Aid Scan','http://api2.grassroots.hostings.co.uk/storage/ea/420/1562322869_sample.pdf',4,'2019-07-05 11:34:29','2019-07-26 01:00:00',1),
	(230,420,'FA Coaching Licence','http://api2.grassroots.hostings.co.uk/storage/fa-coaching-licence/420/1562322869_sample.pdf',5,'2019-07-05 11:34:29','2019-08-03 01:00:00',1),
	(231,426,'CRB Scan','http://api2.grassroots.hostings.co.uk/storage/sc/231/1563532763_Document1.pdf',1,'2019-07-19 10:16:16','2019-10-05 01:00:00',1),
	(232,426,'Safeguarding Children Scan','http://api2.grassroots.hostings.co.uk/storage/sc/426/1563527776_Document1.pdf',2,'2019-07-19 10:16:16','2019-08-02 01:00:00',1),
	(233,426,'FA Level 1 Scan','http://api2.grassroots.hostings.co.uk/storage/fa-level-1/426/1563527776_Document1.pdf',3,'2019-07-19 10:16:16',NULL,1),
	(234,426,'FA Level 2 Scan','http://api2.grassroots.hostings.co.uk/storage/fa-level-2/426/1563527776_Document1.pdf',3,'2019-07-19 10:16:16',NULL,1),
	(235,426,'Emergency Aid Scan','http://api2.grassroots.hostings.co.uk/storage/ea/426/1563527776_Document1.pdf',4,'2019-07-19 10:16:16','2019-08-01 01:00:00',1),
	(236,426,'FA Coaching Licence','http://api2.grassroots.hostings.co.uk/storage/fa-coaching-licence/426/1563527776_Document1.pdf',5,'2019-07-19 10:16:16','2019-08-01 01:00:00',1),
	(237,427,'CRB Scan','http://api2.grassroots.hostings.co.uk/storage/crb/427/1563533157_Document1.pdf',1,'2019-07-19 11:45:57','2019-08-02 01:00:00',1),
	(238,427,'Safeguarding Children Scan','http://api2.grassroots.hostings.co.uk/storage/sc/427/1563533157_Document1.pdf',2,'2019-07-19 11:45:57','2019-08-01 01:00:00',1),
	(239,427,'FA Level 1 Scan','',3,'2019-07-19 11:45:57',NULL,1),
	(240,427,'FA Level 2 Scan','',3,'2019-07-19 11:45:57',NULL,1),
	(241,427,'Emergency Aid Scan','http://api2.grassroots.hostings.co.uk/storage/ea/427/1563533157_Document1.pdf',4,'2019-07-19 11:45:57','2019-08-02 01:00:00',1),
	(242,427,'FA Coaching Licence','',5,'2019-07-19 11:45:57',NULL,1),
	(243,429,'CRB Scan','http://api2.grassroots.hostings.co.uk/storage/crb/429/1563546563_sample.pdf',1,'2019-07-19 15:29:23','0000-00-00 00:00:00',1),
	(244,429,'Safeguarding Children Scan','http://api2.grassroots.hostings.co.uk/storage/sc/429/1563546563_sample.pdf',2,'2019-07-19 15:29:23','0000-00-00 00:00:00',1),
	(245,429,'FA Level 1 Scan','http://api2.grassroots.hostings.co.uk/storage/fa-level-1/429/1563546563_sample.pdf',3,'2019-07-19 15:29:23',NULL,1),
	(246,429,'FA Level 2 Scan','http://api2.grassroots.hostings.co.uk/storage/fa-level-2/429/1563546563_sample.pdf',3,'2019-07-19 15:29:23',NULL,1),
	(247,429,'Emergency Aid Scan','http://api2.grassroots.hostings.co.uk/storage/ea/429/1563546563_sample.pdf',4,'2019-07-19 15:29:23','0000-00-00 00:00:00',1),
	(248,429,'FA Coaching Licence','http://api2.grassroots.hostings.co.uk/storage/fa-coaching-licence/429/1563546563_sample.pdf',5,'2019-07-19 15:29:23','2019-07-28 01:00:00',1),
	(249,437,'CRB Scan','http://api2.grassroots.hostings.co.uk/storage/crb/437/1565784645_sample.pdf',1,'2019-08-14 13:10:45','2020-10-23 01:00:00',1),
	(250,437,'Safeguarding Children Scan','http://api2.grassroots.hostings.co.uk/storage/sc/437/1565784645_sample.pdf',2,'2019-08-14 13:10:45','2020-09-26 01:00:00',1),
	(251,437,'FA Level 1 Scan','http://api2.grassroots.hostings.co.uk/storage/fa-level-1/437/1565784645_sample.pdf',3,'2019-08-14 13:10:45',NULL,1),
	(252,437,'FA Level 2 Scan','http://api2.grassroots.hostings.co.uk/storage/fa-level-2/437/1565784645_save(1).png',3,'2019-08-14 13:10:45',NULL,1),
	(253,437,'Emergency Aid Scan','http://api2.grassroots.hostings.co.uk/storage/ea/437/1565784645_sample.pdf',4,'2019-08-14 13:10:45','2020-10-30 00:00:00',1),
	(254,437,'FA Coaching Licence','http://api2.grassroots.hostings.co.uk/storage/fa-coaching-licence/437/1565784645_sample.pdf',5,'2019-08-14 13:10:45','2020-09-27 01:00:00',1),
	(255,441,'CRB Scan','http://api2.grassroots.hostings.co.uk/storage/crb/441/1566467248_sample.pdf',1,'2019-08-22 10:47:28','2019-10-25 01:00:00',1),
	(256,441,'Safeguarding Children Scan','http://api2.grassroots.hostings.co.uk/storage/sc/441/1566467248_sample.pdf',2,'2019-08-22 10:47:28','2019-11-14 00:00:00',1),
	(257,441,'FA Level 1 Scan','http://api2.grassroots.hostings.co.uk/storage/fa-level-1/441/1566467248_sample.pdf',3,'2019-08-22 10:47:28',NULL,1),
	(258,441,'FA Level 2 Scan','http://api2.grassroots.hostings.co.uk/storage/fa-level-2/441/1566467248_sample.pdf',3,'2019-08-22 10:47:28',NULL,1),
	(259,441,'Emergency Aid Scan','http://api2.grassroots.hostings.co.uk/storage/ea/441/1566467248_sample.pdf',4,'2019-08-22 10:47:28','2019-12-06 00:00:00',1),
	(260,441,'FA Coaching Licence','http://api2.grassroots.hostings.co.uk/storage/fa-coaching-licence/441/1566467248_sample.pdf',5,'2019-08-22 10:47:28','2019-11-13 00:00:00',1);

/*!40000 ALTER TABLE `scan` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table scan_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `scan_type`;

CREATE TABLE `scan_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`type_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `scan_type` WRITE;
/*!40000 ALTER TABLE `scan_type` DISABLE KEYS */;

INSERT INTO `scan_type` (`type_id`, `franchise_id`, `club_id`, `title`, `created_at`, `created_by`, `status`)
VALUES
	(1,0,0,'CRB','2017-07-27 12:40:07',2,1),
	(2,0,0,'SC','2017-07-27 12:40:11',2,1),
	(3,0,0,'FA Level 1','2017-07-27 12:40:17',2,1),
	(4,0,0,'EA','2017-07-27 12:40:26',2,1),
	(5,0,0,'FA Coaching Licence','2017-07-27 12:40:35',2,1);

/*!40000 ALTER TABLE `scan_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `session`;

CREATE TABLE `session` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `programme_id` int(11) NOT NULL,
  `coach_id` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `index` int(4) NOT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `price2` decimal(8,2) DEFAULT NULL,
  `price2plus` decimal(8,2) DEFAULT NULL,
  `surface` varchar(255) DEFAULT NULL,
  `guest_no` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `pitch_size` varchar(20) DEFAULT NULL,
  `pitch_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  KEY `programme_id` (`programme_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;

INSERT INTO `session` (`session_id`, `programme_id`, `coach_id`, `status`, `index`, `start_time`, `end_time`, `venue_id`, `price`, `price2`, `price2plus`, `surface`, `guest_no`, `created_at`, `created_by`, `updated_at`, `updated_by`, `pitch_size`, `pitch_no`)
VALUES
	(52,12,420,1,0,'2019-07-06 18:30:00','2019-07-06 20:30:00',9155,12.00,10.00,8.00,'Indoor',NULL,'2019-07-05 13:00:25',418,'2019-07-05 13:00:25',418,NULL,NULL),
	(53,12,420,1,0,'2019-07-13 18:30:00','2019-07-13 20:30:00',9155,12.00,10.00,8.00,'Indoor',NULL,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26',418,NULL,NULL),
	(54,12,420,1,0,'2019-06-20 18:30:00','2019-06-20 20:30:00',9155,12.00,10.00,8.00,'Indoor',NULL,'2019-07-05 13:00:26',418,'2019-07-05 16:19:41',418,NULL,NULL),
	(55,12,420,1,0,'2019-07-27 18:30:00','2019-07-27 20:30:00',9155,12.00,10.00,8.00,'Indoor',NULL,'2019-07-05 13:00:26',418,'2019-07-05 13:00:26',418,NULL,NULL),
	(56,12,420,1,0,'2019-08-03 19:30:00','2019-08-03 20:30:00',9155,12.00,10.00,8.00,'Indoor',NULL,'2019-07-05 13:00:26',418,'2019-07-31 18:37:34',418,NULL,NULL),
	(57,13,429,1,0,'2019-08-10 17:25:00','2019-08-10 20:35:00',9155,10.00,8.00,6.00,'3G',NULL,'2019-07-17 15:50:26',418,'2019-07-22 16:08:01',418,NULL,NULL),
	(58,13,420,1,0,'2019-08-28 18:00:00','2019-08-28 21:00:00',9155,10.00,8.00,6.00,'3G',NULL,'2019-07-17 15:50:26',418,'2019-08-10 02:59:13',418,NULL,NULL),
	(59,13,420,1,0,'2019-07-29 17:25:00','2019-07-29 20:35:00',9155,10.00,8.00,6.00,'3G',NULL,'2019-07-17 15:50:26',418,'2019-07-17 15:50:26',418,NULL,NULL),
	(60,13,420,1,0,'2019-07-30 17:25:00','2019-07-30 20:35:00',9155,10.00,8.00,6.00,'3G',NULL,'2019-07-17 15:50:26',418,'2019-07-17 15:50:26',418,NULL,NULL),
	(61,14,426,1,0,'2019-09-11 11:45:00','2019-09-11 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424,NULL,NULL),
	(62,14,426,1,0,'2019-09-18 11:45:00','2019-09-18 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424,NULL,NULL),
	(63,14,426,1,0,'2019-09-25 11:45:00','2019-09-25 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424,NULL,NULL),
	(64,14,426,1,0,'2019-10-02 11:45:00','2019-10-02 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424,NULL,NULL),
	(65,14,426,1,0,'2019-10-09 11:45:00','2019-10-09 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424,NULL,NULL),
	(66,14,426,1,0,'2019-10-16 11:45:00','2019-10-16 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424,NULL,NULL),
	(67,14,426,1,0,'2019-10-30 10:45:00','2019-10-30 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:17',424,'2019-07-19 10:55:17',424,NULL,NULL),
	(68,14,426,1,0,'2019-11-06 10:45:00','2019-11-06 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(69,14,426,1,0,'2019-11-13 10:45:00','2019-11-13 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(70,14,426,1,0,'2019-11-20 10:45:00','2019-11-20 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(71,14,426,1,0,'2019-11-27 10:45:00','2019-11-27 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(72,14,426,1,0,'2019-12-04 10:45:00','2019-12-04 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(73,14,426,1,0,'2019-12-11 10:45:00','2019-12-11 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(74,14,426,1,0,'2019-12-18 10:45:00','2019-12-18 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(75,14,426,1,0,'2019-12-25 10:45:00','2019-12-25 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(76,14,426,1,0,'2020-01-01 10:45:00','2020-01-01 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(77,14,426,1,0,'2020-01-08 10:45:00','2020-01-08 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(78,14,426,1,0,'2020-01-15 10:45:00','2020-01-15 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(79,14,426,1,0,'2020-01-22 10:45:00','2020-01-22 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(80,14,426,1,0,'2020-01-29 10:45:00','2020-01-29 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(81,14,426,1,0,'2020-02-05 10:45:00','2020-02-05 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(82,14,426,1,0,'2020-02-12 10:45:00','2020-02-12 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(83,14,426,1,0,'2020-02-19 10:45:00','2020-02-19 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(84,14,426,1,0,'2020-02-26 10:45:00','2020-02-26 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(85,14,426,1,0,'2020-03-04 10:45:00','2020-03-04 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(86,14,426,1,0,'2020-03-11 10:45:00','2020-03-11 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(87,14,426,1,0,'2020-03-18 10:45:00','2020-03-18 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(88,14,426,1,0,'2020-04-01 11:45:00','2020-04-01 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(89,14,426,1,0,'2020-04-08 11:45:00','2020-04-08 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(90,14,426,1,0,'2020-04-15 11:45:00','2020-04-15 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(91,14,426,1,0,'2020-04-22 11:45:00','2020-04-22 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(92,14,426,1,0,'2020-04-29 11:45:00','2020-04-29 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(93,14,426,1,0,'2020-05-06 11:45:00','2020-05-06 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(94,15,426,1,0,'2019-09-11 11:45:00','2019-09-11 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(95,15,426,1,0,'2019-09-18 11:45:00','2019-09-18 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(96,15,426,1,0,'2019-09-25 11:45:00','2019-09-25 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(97,15,426,1,0,'2019-10-02 11:45:00','2019-10-02 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(98,15,426,1,0,'2019-10-09 11:45:00','2019-10-09 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(99,15,426,1,0,'2019-10-16 11:45:00','2019-10-16 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(100,15,426,1,0,'2019-10-30 10:45:00','2019-10-30 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(101,15,426,1,0,'2019-11-06 10:45:00','2019-11-06 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(102,15,426,1,0,'2019-11-13 10:45:00','2019-11-13 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(103,15,426,1,0,'2019-11-20 10:45:00','2019-11-20 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(104,15,426,1,0,'2019-11-27 10:45:00','2019-11-27 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(105,15,426,1,0,'2019-12-04 10:45:00','2019-12-04 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(106,15,426,1,0,'2019-12-11 10:45:00','2019-12-11 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(107,15,426,1,0,'2019-12-18 10:45:00','2019-12-18 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(108,15,426,1,0,'2019-12-25 10:45:00','2019-12-25 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(109,15,426,1,0,'2020-01-01 10:45:00','2020-01-01 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(110,15,426,1,0,'2020-01-08 10:45:00','2020-01-08 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(111,15,426,1,0,'2020-01-15 10:45:00','2020-01-15 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(112,15,426,1,0,'2020-01-22 10:45:00','2020-01-22 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(113,15,426,1,0,'2020-01-29 10:45:00','2020-01-29 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(114,15,426,1,0,'2020-02-05 10:45:00','2020-02-05 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(115,15,426,1,0,'2020-02-12 10:45:00','2020-02-12 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(116,15,426,1,0,'2020-02-19 10:45:00','2020-02-19 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(117,15,426,1,0,'2020-02-26 10:45:00','2020-02-26 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(118,15,426,1,0,'2020-03-04 10:45:00','2020-03-04 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(119,15,426,1,0,'2020-03-11 10:45:00','2020-03-11 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(120,15,426,1,0,'2020-03-18 10:45:00','2020-03-18 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(121,15,426,1,0,'2020-04-01 11:45:00','2020-04-01 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(122,15,426,1,0,'2020-04-08 11:45:00','2020-04-08 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(123,15,426,1,0,'2020-04-15 11:45:00','2020-04-15 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(124,15,426,1,0,'2020-04-22 11:45:00','2020-04-22 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(125,15,426,1,0,'2020-04-29 11:45:00','2020-04-29 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(126,15,426,1,0,'2020-05-06 11:45:00','2020-05-06 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(127,16,426,1,0,'2019-09-11 11:45:00','2019-09-11 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(128,16,426,1,0,'2019-09-18 11:45:00','2019-09-18 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(129,16,426,1,0,'2019-09-25 11:45:00','2019-09-25 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(130,16,426,1,0,'2019-10-02 11:45:00','2019-10-02 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(131,16,426,1,0,'2019-10-09 11:45:00','2019-10-09 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(132,16,426,1,0,'2019-10-16 11:45:00','2019-10-16 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(133,16,426,1,0,'2019-10-30 10:45:00','2019-10-30 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(134,16,426,1,0,'2019-11-06 10:45:00','2019-11-06 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(135,16,426,1,0,'2019-11-13 10:45:00','2019-11-13 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(136,16,426,1,0,'2019-11-20 10:45:00','2019-11-20 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(137,16,426,1,0,'2019-11-27 10:45:00','2019-11-27 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(138,16,426,1,0,'2019-12-04 10:45:00','2019-12-04 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(139,16,426,1,0,'2019-12-11 10:45:00','2019-12-11 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(140,16,426,1,0,'2019-12-18 10:45:00','2019-12-18 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(141,16,426,1,0,'2019-12-25 10:45:00','2019-12-25 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(142,16,426,1,0,'2020-01-01 10:45:00','2020-01-01 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(143,16,426,1,0,'2020-01-08 10:45:00','2020-01-08 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(144,16,426,1,0,'2020-01-15 10:45:00','2020-01-15 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(145,16,426,1,0,'2020-01-22 10:45:00','2020-01-22 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(146,16,426,1,0,'2020-01-29 10:45:00','2020-01-29 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(147,16,426,1,0,'2020-02-05 10:45:00','2020-02-05 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(148,16,426,1,0,'2020-02-12 10:45:00','2020-02-12 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(149,16,426,1,0,'2020-02-19 10:45:00','2020-02-19 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(150,16,426,1,0,'2020-02-26 10:45:00','2020-02-26 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(151,16,426,1,0,'2020-03-04 10:45:00','2020-03-04 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(152,16,426,1,0,'2020-03-11 10:45:00','2020-03-11 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(153,16,426,1,0,'2020-03-18 10:45:00','2020-03-18 13:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(154,16,426,1,0,'2020-04-01 11:45:00','2020-04-01 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(155,16,426,1,0,'2020-04-08 11:45:00','2020-04-08 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(156,16,426,1,0,'2020-04-15 11:45:00','2020-04-15 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(157,16,426,1,0,'2020-04-22 11:45:00','2020-04-22 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(158,16,426,1,0,'2020-04-29 11:45:00','2020-04-29 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(159,16,426,1,0,'2020-05-06 11:45:00','2020-05-06 14:45:00',9161,15.00,14.00,13.00,'3G',NULL,'2019-07-19 10:55:18',424,'2019-07-19 10:55:18',424,NULL,NULL),
	(160,17,427,1,0,'2019-07-20 11:45:00','2019-07-20 14:45:00',9161,13.00,12.00,11.00,NULL,NULL,'2019-07-19 10:57:40',424,'2019-07-19 16:01:32',424,NULL,NULL),
	(161,17,426,1,0,'2019-07-27 11:45:00','2019-07-27 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(162,17,427,1,0,'2019-08-03 11:45:00','2019-08-03 14:45:00',9161,13.00,12.00,11.00,NULL,NULL,'2019-07-19 10:57:40',424,'2019-07-19 16:01:45',424,NULL,NULL),
	(163,17,426,1,0,'2019-08-10 11:45:00','2019-08-10 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(164,17,426,1,0,'2019-08-17 11:45:00','2019-08-17 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(165,17,426,1,0,'2019-08-24 11:45:00','2019-08-24 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(166,17,426,1,0,'2019-08-31 11:45:00','2019-08-31 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(167,17,426,1,0,'2019-09-07 11:45:00','2019-09-07 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(168,17,426,1,0,'2019-09-14 11:45:00','2019-09-14 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(169,17,426,1,0,'2019-09-21 11:45:00','2019-09-21 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(170,17,426,1,0,'2019-09-28 11:45:00','2019-09-28 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(171,17,426,1,0,'2019-10-05 11:45:00','2019-10-05 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(172,17,426,1,0,'2019-10-12 11:45:00','2019-10-12 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(173,17,426,1,0,'2019-10-19 11:45:00','2019-10-19 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(174,17,426,1,0,'2019-10-26 11:45:00','2019-10-26 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(175,17,426,1,0,'2019-11-02 10:45:00','2019-11-02 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(176,17,426,1,0,'2019-11-09 10:45:00','2019-11-09 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(177,17,426,1,0,'2019-11-16 10:45:00','2019-11-16 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(178,17,426,1,0,'2019-11-23 10:45:00','2019-11-23 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(179,17,426,1,0,'2019-11-30 10:45:00','2019-11-30 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(180,17,426,1,0,'2019-12-07 10:45:00','2019-12-07 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(181,17,426,1,0,'2019-12-14 10:45:00','2019-12-14 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(182,17,426,1,0,'2019-12-21 10:45:00','2019-12-21 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(183,17,426,1,0,'2019-12-28 10:45:00','2019-12-28 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(184,17,426,1,0,'2020-01-04 10:45:00','2020-01-04 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(185,18,427,1,0,'2019-07-20 11:45:00','2019-07-20 14:45:00',9161,13.00,12.00,11.00,NULL,NULL,'2019-07-19 10:57:40',424,'2019-07-19 16:02:19',424,NULL,NULL),
	(186,18,426,1,0,'2019-07-27 11:45:00','2019-07-27 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(187,18,426,1,0,'2019-08-03 11:45:00','2019-08-03 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(188,18,426,1,0,'2019-08-10 11:45:00','2019-08-10 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(189,18,426,1,0,'2019-08-17 11:45:00','2019-08-17 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(190,18,426,1,0,'2019-08-24 11:45:00','2019-08-24 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(191,18,426,1,0,'2019-08-31 11:45:00','2019-08-31 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(192,18,426,1,0,'2019-09-07 11:45:00','2019-09-07 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(193,18,426,1,0,'2019-09-14 11:45:00','2019-09-14 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(194,18,426,1,0,'2019-09-21 11:45:00','2019-09-21 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(195,18,426,1,0,'2019-09-28 11:45:00','2019-09-28 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(196,18,426,1,0,'2019-10-05 11:45:00','2019-10-05 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(197,18,426,1,0,'2019-10-12 11:45:00','2019-10-12 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(198,18,426,1,0,'2019-10-19 11:45:00','2019-10-19 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(199,18,426,1,0,'2019-10-26 11:45:00','2019-10-26 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(200,18,426,1,0,'2019-11-02 10:45:00','2019-11-02 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(201,18,426,1,0,'2019-11-09 10:45:00','2019-11-09 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(202,18,426,1,0,'2019-11-16 10:45:00','2019-11-16 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(203,18,426,1,0,'2019-11-23 10:45:00','2019-11-23 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(204,18,426,1,0,'2019-11-30 10:45:00','2019-11-30 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(205,18,426,1,0,'2019-12-07 10:45:00','2019-12-07 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(206,18,426,1,0,'2019-12-14 10:45:00','2019-12-14 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(207,18,426,1,0,'2019-12-21 10:45:00','2019-12-21 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(208,18,426,1,0,'2019-12-28 10:45:00','2019-12-28 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(209,18,426,1,0,'2020-01-04 10:45:00','2020-01-04 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(210,19,426,1,0,'2019-07-20 11:45:00','2019-07-20 14:45:00',9161,13.00,12.00,11.00,NULL,NULL,'2019-07-19 10:57:40',424,'2019-07-19 16:03:44',424,NULL,NULL),
	(211,19,426,1,0,'2019-07-27 11:45:00','2019-07-27 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(212,19,427,1,0,'2019-08-03 11:45:00','2019-08-03 14:45:00',9161,13.00,12.00,11.00,NULL,NULL,'2019-07-19 10:57:40',424,'2019-07-19 11:46:08',424,NULL,NULL),
	(213,19,426,1,0,'2019-08-10 11:45:00','2019-08-10 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(214,19,426,1,0,'2019-08-17 11:45:00','2019-08-17 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(215,19,426,1,0,'2019-08-24 11:45:00','2019-08-24 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(216,19,426,1,0,'2019-08-31 11:45:00','2019-08-31 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(217,19,426,1,0,'2019-09-07 11:45:00','2019-09-07 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(218,19,426,1,0,'2019-09-14 11:45:00','2019-09-14 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(219,19,426,1,0,'2019-09-21 11:45:00','2019-09-21 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(220,19,426,1,0,'2019-09-28 11:45:00','2019-09-28 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(221,19,426,1,0,'2019-10-05 11:45:00','2019-10-05 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(222,19,426,1,0,'2019-10-12 11:45:00','2019-10-12 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(223,19,426,1,0,'2019-10-19 11:45:00','2019-10-19 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(224,19,426,1,0,'2019-10-26 11:45:00','2019-10-26 14:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(225,19,426,1,0,'2019-11-02 10:45:00','2019-11-02 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(226,19,426,1,0,'2019-11-09 10:45:00','2019-11-09 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(227,19,426,1,0,'2019-11-16 10:45:00','2019-11-16 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(228,19,426,1,0,'2019-11-23 10:45:00','2019-11-23 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(229,19,426,1,0,'2019-11-30 10:45:00','2019-11-30 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(230,19,426,1,0,'2019-12-07 10:45:00','2019-12-07 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(231,19,426,1,0,'2019-12-14 10:45:00','2019-12-14 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(232,19,426,1,0,'2019-12-21 10:45:00','2019-12-21 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(233,19,426,1,0,'2019-12-28 10:45:00','2019-12-28 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(234,19,426,1,0,'2020-01-04 10:45:00','2020-01-04 13:45:00',9161,13.00,12.00,11.00,'Grass',NULL,'2019-07-19 10:57:40',424,'2019-07-19 10:57:40',424,NULL,NULL),
	(235,20,427,1,0,'2019-08-03 17:30:00','2019-08-03 19:30:00',9161,10.00,8.00,6.00,'Indoor',NULL,'2019-07-22 10:40:54',425,'2019-07-22 10:40:54',425,NULL,NULL),
	(236,20,427,1,0,'2019-08-10 17:30:00','2019-08-10 19:30:00',9161,10.00,8.00,6.00,'Indoor',NULL,'2019-07-22 10:40:54',425,'2019-07-22 10:40:54',425,NULL,NULL),
	(237,21,426,1,0,'2019-08-03 17:30:00','2019-08-03 19:30:00',9161,10.00,8.00,6.00,'Indoor',NULL,'2019-07-22 13:20:47',425,'2019-07-22 13:20:47',425,NULL,NULL),
	(238,21,426,1,0,'2019-08-10 17:30:00','2019-08-10 19:30:00',9161,10.00,8.00,6.00,'Indoor',NULL,'2019-07-22 13:20:47',425,'2019-07-22 13:20:47',425,NULL,NULL),
	(239,22,426,1,0,'2019-08-03 17:30:00','2019-08-03 19:30:00',9161,10.00,8.00,6.00,'Indoor',NULL,'2019-07-22 13:23:04',425,'2019-07-22 13:23:04',425,NULL,NULL),
	(240,22,426,1,0,'2019-08-10 17:30:00','2019-08-10 19:30:00',9161,10.00,8.00,6.00,'Indoor',NULL,'2019-07-22 13:23:04',425,'2019-07-22 13:23:04',425,NULL,NULL),
	(241,23,420,1,0,'2019-08-21 17:30:00','2019-08-21 19:30:00',9155,12.00,10.00,8.00,'Indoor',NULL,'2019-08-14 11:48:05',418,'2019-08-14 11:48:05',418,NULL,NULL),
	(242,23,420,1,0,'2019-08-28 17:30:00','2019-08-28 19:30:00',9155,12.00,10.00,8.00,'Indoor',NULL,'2019-08-14 11:48:05',418,'2019-08-14 11:48:05',418,NULL,NULL),
	(243,24,420,1,0,'2019-08-25 17:30:00',NULL,9155,10.00,9.00,8.00,'3G',NULL,'2019-08-19 09:42:12',418,'2019-08-19 09:42:12',418,NULL,NULL),
	(244,25,429,1,0,'2019-08-30 16:30:00','2019-08-30 17:35:00',9178,10.00,9.00,8.00,'3G Outdoor',NULL,'2019-08-19 12:08:30',418,'2019-08-29 12:33:00',418,NULL,NULL),
	(245,25,429,1,0,'2019-09-01 16:30:00','2019-09-01 17:30:00',9155,10.00,9.00,8.00,'3G Outdoor',NULL,'2019-08-19 12:08:30',418,'2019-08-19 12:08:30',418,NULL,NULL),
	(246,26,437,1,0,'2019-08-25 17:30:00','2019-08-25 19:30:00',9155,20.00,15.00,10.00,'Indoor',NULL,'2019-08-19 12:12:56',418,'2019-08-19 12:12:56',418,NULL,NULL),
	(247,26,437,1,0,'2019-09-01 17:30:00','2019-09-01 19:30:00',9155,20.00,15.00,10.00,'Indoor',NULL,'2019-08-19 12:12:56',418,'2019-08-19 12:12:56',418,NULL,NULL),
	(248,27,437,1,0,'2019-08-25 17:30:00','2019-08-25 19:30:00',9155,20.00,15.00,10.00,'Indoor',NULL,'2019-08-19 12:14:08',418,'2019-08-19 12:14:08',418,NULL,NULL),
	(249,27,437,1,0,'2019-09-01 17:30:00','2019-09-01 19:30:00',9155,20.00,15.00,10.00,'Indoor',NULL,'2019-08-19 12:14:08',418,'2019-08-19 12:14:08',418,NULL,NULL),
	(250,28,437,1,0,'2019-08-25 17:30:00','2019-08-25 19:30:00',9155,20.00,15.00,10.00,'Indoor',NULL,'2019-08-19 12:16:35',418,'2019-08-19 12:16:35',418,NULL,NULL),
	(251,28,437,1,0,'2019-09-01 17:30:00','2019-09-01 19:30:00',9155,20.00,15.00,10.00,'Indoor',NULL,'2019-08-19 12:16:35',418,'2019-08-19 12:16:35',418,NULL,NULL),
	(252,29,420,1,0,'2019-08-25 17:30:00','2019-08-25 19:30:00',9155,12.00,10.00,8.00,'3G Outdoor',NULL,'2019-08-20 15:22:15',418,'2019-08-20 15:22:15',418,NULL,NULL),
	(253,29,420,1,0,'2019-09-01 17:30:00','2019-09-01 19:30:00',9176,12.00,10.00,8.00,'3G Outdoor',NULL,'2019-08-20 15:22:16',418,'2019-08-29 12:45:13',418,NULL,NULL),
	(254,30,429,1,0,'2019-08-30 11:40:00','2019-08-30 19:30:00',9176,1.00,2.00,3.00,'indoor',NULL,'2019-08-27 15:27:13',418,'2019-08-29 11:54:24',418,NULL,NULL);

/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table site_option
# ------------------------------------------------------------

DROP TABLE IF EXISTS `site_option`;

CREATE TABLE `site_option` (
  `option_id` int(11) NOT NULL,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `option_name` varchar(255) NOT NULL,
  `option_value` text NOT NULL,
  PRIMARY KEY (`option_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table skill
# ------------------------------------------------------------

DROP TABLE IF EXISTS `skill`;

CREATE TABLE `skill` (
  `skill_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `order` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`skill_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;

INSERT INTO `skill` (`skill_id`, `franchise_id`, `club_id`, `title`, `category_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `order`, `status`)
VALUES
	(152,145,105,'Finishing',4,'2019-07-05 17:17:29',418,'2019-07-05 17:17:29',418,0,1),
	(153,145,105,'Marking',4,'2019-07-05 17:17:33',418,'2019-07-05 17:17:33',418,0,1),
	(154,145,105,'Passing',4,'2019-07-05 17:17:38',418,'2019-07-05 17:17:38',418,0,1),
	(155,145,105,'Good manners',3,'2019-07-05 17:19:15',418,'2019-07-05 17:19:15',418,0,1),
	(156,145,105,'Active Listining',3,'2019-07-05 17:19:24',418,'2019-07-05 17:19:24',418,0,1),
	(157,145,105,'Gestures',3,'2019-07-05 17:19:27',418,'2019-07-05 17:19:27',418,0,1),
	(158,145,105,'Thinking',3,'2019-07-05 17:19:34',418,'2019-07-05 17:19:34',418,0,1),
	(159,145,105,'Speaking',3,'2019-07-05 17:19:39',418,'2019-07-05 17:19:39',418,0,1),
	(160,145,105,'Ball Control',1,'2019-07-05 17:20:09',418,'2019-07-05 17:20:09',418,0,1),
	(161,145,105,'Dribbling',1,'2019-07-05 17:20:14',418,'2019-07-05 17:20:14',418,0,1),
	(162,145,105,'Passing',1,'2019-07-05 17:20:17',418,'2019-07-05 17:20:17',418,0,1),
	(163,145,105,'Self talk',2,'2019-07-05 17:21:03',418,'2019-07-05 17:21:03',418,0,1),
	(164,145,105,'Goals & commitment',2,'2019-07-05 17:21:11',418,'2019-07-05 17:21:11',418,0,1),
	(165,145,105,'Motivation',2,'2019-07-05 17:21:14',418,'2019-07-05 17:21:14',418,0,1),
	(166,145,105,'Attitude',2,'2019-07-05 17:21:17',418,'2019-07-05 17:21:17',418,0,1),
	(167,146,107,'Jumping',4,'2019-07-19 10:34:18',424,'2019-07-19 10:34:18',424,0,1),
	(168,146,107,'Running',4,'2019-07-19 10:34:21',424,'2019-07-19 10:34:21',424,0,1),
	(169,146,107,'Skipping',4,'2019-07-19 10:34:38',424,'2019-07-19 10:34:38',424,0,1),
	(170,146,107,'Thinking',2,'2019-07-19 10:34:46',424,'2019-07-19 10:34:46',424,0,1),
	(171,146,107,'Decisions',2,'2019-07-19 10:34:51',424,'2019-07-19 10:34:51',424,0,1),
	(172,146,107,'Confidence',2,'2019-07-19 10:34:56',424,'2019-07-19 10:34:56',424,0,1),
	(173,146,107,'Communication',3,'2019-07-19 10:35:01',424,'2019-07-19 10:35:01',424,0,1),
	(174,146,107,'Leadership',3,'2019-07-19 10:35:06',424,'2019-07-19 10:35:06',424,0,1),
	(175,146,107,'Shooting',1,'2019-07-19 10:35:10',424,'2019-07-19 10:35:10',424,0,1),
	(176,146,107,'Passing',1,'2019-07-19 10:35:13',424,'2019-07-19 10:35:13',424,0,1),
	(177,146,107,'Heading',1,'2019-07-19 10:35:17',424,'2019-07-19 10:35:17',424,0,1);

/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table skill_assessment_note
# ------------------------------------------------------------

DROP TABLE IF EXISTS `skill_assessment_note`;

CREATE TABLE `skill_assessment_note` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT,
  `note` text,
  PRIMARY KEY (`note_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `skill_assessment_note` WRITE;
/*!40000 ALTER TABLE `skill_assessment_note` DISABLE KEYS */;

INSERT INTO `skill_assessment_note` (`note_id`, `note`)
VALUES
	(8,'Some note');

/*!40000 ALTER TABLE `skill_assessment_note` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table skill_category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `skill_category`;

CREATE TABLE `skill_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`category_id`),
  KEY `franchise_id` (`franchise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `skill_category` WRITE;
/*!40000 ALTER TABLE `skill_category` DISABLE KEYS */;

INSERT INTO `skill_category` (`category_id`, `franchise_id`, `title`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(1,0,'Technical','2017-01-30 15:07:28',2,'2017-07-12 10:50:29',2,1),
	(2,0,'Psychological','2017-01-30 15:08:05',2,'2017-07-12 10:50:29',2,1),
	(3,0,'Social','2017-01-30 15:08:25',2,'2017-07-12 10:50:29',2,1),
	(4,0,'Physical','2017-01-30 15:08:39',2,'2017-07-12 10:50:30',2,1);

/*!40000 ALTER TABLE `skill_category` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table skill_grade
# ------------------------------------------------------------

DROP TABLE IF EXISTS `skill_grade`;

CREATE TABLE `skill_grade` (
  `grade_id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `coach_id` int(11) NOT NULL,
  `team_id` int(111) NOT NULL,
  `grade` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `note_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`grade_id`),
  KEY `player_id` (`player_id`),
  KEY `skill_id` (`skill_id`),
  KEY `coach_id` (`coach_id`),
  KEY `team_id` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `skill_grade` WRITE;
/*!40000 ALTER TABLE `skill_grade` DISABLE KEYS */;

INSERT INTO `skill_grade` (`grade_id`, `player_id`, `skill_id`, `coach_id`, `team_id`, `grade`, `created_at`, `created_by`, `status`, `note_id`)
VALUES
	(7352,216,161,420,315,4,'2019-07-03 01:00:00',420,1,8),
	(7353,216,162,420,315,6,'2019-07-03 01:00:00',420,1,8),
	(7354,216,160,420,315,2,'2019-07-03 01:00:00',420,1,8),
	(7355,216,163,420,315,6,'2019-07-03 01:00:00',420,1,8),
	(7356,216,164,420,315,4,'2019-07-03 01:00:00',420,1,8),
	(7357,216,165,420,315,7,'2019-07-03 01:00:00',420,1,8),
	(7358,216,166,420,315,8,'2019-07-03 01:00:00',420,1,8),
	(7359,216,155,420,315,3,'2019-07-03 01:00:00',420,1,8),
	(7360,216,156,420,315,5,'2019-07-03 01:00:00',420,1,8),
	(7361,216,157,420,315,8,'2019-07-03 01:00:00',420,1,8),
	(7362,216,158,420,315,9,'2019-07-03 01:00:00',420,1,8),
	(7363,216,159,420,315,10,'2019-07-03 01:00:00',420,1,8);

/*!40000 ALTER TABLE `skill_grade` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sponsor
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sponsor`;

CREATE TABLE `sponsor` (
  `sponsor_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `url` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `order` int(11) DEFAULT '1',
  `status` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`sponsor_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `sponsor` WRITE;
/*!40000 ALTER TABLE `sponsor` DISABLE KEYS */;

INSERT INTO `sponsor` (`sponsor_id`, `franchise_id`, `club_id`, `title`, `content`, `url`, `logo_url`, `created_at`, `created_by`, `updated_at`, `updated_by`, `order`, `status`)
VALUES
	(1,146,107,'Nike',NULL,'nike.com','http://api2.grassroots.hostings.co.uk/storage/sponsors/146/1563527872_nike.jpg','2019-07-19 10:17:52',424,'2019-07-19 10:17:52',424,1,1),
	(2,146,107,'Addidas',NULL,'addidas.com','http://api2.grassroots.hostings.co.uk/storage/sponsors/146/1563528154_addidas.png','2019-07-19 10:22:34',424,'2019-07-19 10:22:34',424,1,1),
	(3,145,105,'asd',NULL,'asd','http://api2.grassroots.hostings.co.uk/storage/sponsors/145/1566903579_FHMM4RQZYVEGTPQCBOKP2PGKIM.jpg','2019-08-27 11:59:39',418,'2019-08-27 11:59:39',418,1,1),
	(4,145,105,'test',NULL,'test.com','http://api2.grassroots.hostings.co.uk/storage/sponsors/145/1566906655_FHMM4RQZYVEGTPQCBOKP2PGKIM.jpg','2019-08-27 12:50:55',418,'2019-08-27 12:50:55',418,1,1),
	(5,145,105,'test2',NULL,'test2.com','http://api2.grassroots.hostings.co.uk/storage/sponsors/145/1566906915_FHMM4RQZYVEGTPQCBOKP2PGKIM.jpg','2019-08-27 12:55:15',418,'2019-08-27 12:55:15',418,1,1),
	(6,145,105,'asdsad',NULL,'asdsadasd',NULL,'2019-08-27 13:07:06',418,'2019-08-27 13:07:06',418,1,1),
	(7,145,105,'test3',NULL,'test3.com',NULL,'2019-08-27 13:07:23',418,'2019-08-27 13:07:23',418,1,1),
	(8,145,105,'test4',NULL,'test4asdsd',NULL,'2019-08-27 13:08:09',418,'2019-08-27 13:08:09',418,1,1),
	(9,145,105,'Sponson 3',NULL,'alskdjflaksjdlfas',NULL,'2019-08-27 13:14:19',418,'2019-08-27 13:14:19',418,1,1),
	(10,145,105,'asdasd',NULL,'asdasdsad',NULL,'2019-08-27 13:21:24',418,'2019-08-27 13:21:24',418,1,1),
	(11,145,105,'test5',NULL,'test5.com',NULL,'2019-08-27 13:23:18',418,'2019-08-27 13:23:18',418,1,1),
	(12,145,105,'asdasdasds',NULL,'sdsdsdsdsdsd',NULL,'2019-08-27 13:27:02',418,'2019-08-27 13:27:02',418,1,1),
	(13,145,105,'sadsadsad',NULL,'asdadasdad',NULL,'2019-08-27 13:28:03',418,'2019-08-27 13:28:03',418,1,1),
	(14,145,105,'asdasd',NULL,'asdasdsadasd',NULL,'2019-08-27 13:28:37',418,'2019-08-27 13:28:37',418,1,1),
	(15,145,105,'test7',NULL,'test7.com',NULL,'2019-08-27 13:33:49',418,'2019-08-27 13:33:49',418,1,1),
	(16,145,105,'test8',NULL,'test8.com',NULL,'2019-08-27 13:34:52',418,'2019-08-27 13:34:52',418,1,1),
	(17,145,105,'test9',NULL,'test9,com',NULL,'2019-08-27 13:35:15',418,'2019-08-27 13:35:15',418,1,1),
	(18,145,105,'asdasdsad',NULL,'asdasdasd',NULL,'2019-08-27 13:36:19',418,'2019-08-27 13:36:19',418,1,1),
	(19,145,105,'asdasd',NULL,'asdasdasdsadsad',NULL,'2019-08-27 13:37:01',418,'2019-08-27 13:37:01',418,1,1),
	(20,145,105,'asdsdasdsadsad',NULL,'asdasdasdsadsd',NULL,'2019-08-27 13:39:29',418,'2019-08-27 13:39:29',418,1,1);

/*!40000 ALTER TABLE `sponsor` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table subscription_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `subscription_history`;

CREATE TABLE `subscription_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `package_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `start` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(9,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `package_id` (`package_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `subscription_history` WRITE;
/*!40000 ALTER TABLE `subscription_history` DISABLE KEYS */;

INSERT INTO `subscription_history` (`id`, `package_id`, `club_id`, `start`, `end`, `amount`)
VALUES
	(84,40,103,'2019-07-05 10:11:41','2019-08-05 10:11:41',15.00),
	(85,40,104,'2019-07-05 10:11:41','2019-08-05 10:11:41',15.00),
	(86,40,105,'2019-07-05 10:50:26','2019-08-05 10:50:26',15.00),
	(87,39,106,'2019-07-05 10:50:14','2019-08-05 10:50:14',10.00),
	(88,41,107,'2019-07-19 09:47:07','2019-08-19 09:47:07',25.00),
	(89,41,108,'2019-07-31 17:27:54','2019-08-31 17:27:54',25.00),
	(90,41,109,'2019-07-31 14:13:29','2019-08-31 14:13:29',25.00),
	(91,41,110,'2019-07-31 14:13:29','2019-08-31 14:13:29',25.00),
	(92,39,111,'2019-08-14 09:53:51','2019-09-14 09:53:51',10.00),
	(93,42,112,'2019-08-22 10:32:14','2019-09-22 10:32:14',55.00),
	(94,39,113,'2019-08-23 11:17:15','2019-09-23 11:17:15',10.00),
	(95,40,114,'2019-08-23 15:43:35','2019-09-23 15:43:35',15.00),
	(96,39,115,'2019-08-23 15:49:24','2019-09-23 15:49:24',10.00),
	(97,39,116,'2019-08-23 15:50:29','2019-09-23 15:50:29',10.00),
	(98,39,117,'2019-08-23 15:51:16','2019-09-23 15:51:16',10.00),
	(99,41,118,'2019-08-23 15:59:12','2019-09-23 15:59:12',25.00),
	(100,42,119,'2019-08-23 16:06:07','2019-09-23 16:06:07',55.00);

/*!40000 ALTER TABLE `subscription_history` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `team`;

CREATE TABLE `team` (
  `team_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `agegroup_id` int(11) NOT NULL,
  `rank` tinyint(2) NOT NULL DEFAULT '0',
  `type` enum('skill-group','team') NOT NULL DEFAULT 'team',
  `title` varchar(255) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `max_size` int(4) NOT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`team_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`),
  KEY `agegroup_id` (`agegroup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;

INSERT INTO `team` (`team_id`, `franchise_id`, `club_id`, `agegroup_id`, `rank`, `type`, `title`, `logo_url`, `max_size`, `gender`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`)
VALUES
	(315,145,105,18,1,'skill-group','The Gunners','http://api2.grassroots.hostings.co.uk/storage/teams/145/1566921428_leeds_badge.jpg',4502,'boy','2019-08-27 16:57:08',418,'2019-08-27 16:57:08',418,1),
	(316,145,105,18,2,'skill-group','Test T 2','http://api2.grassroots.hostings.co.uk/storage/teams/145/1563527459_ScreenShot2019-07-16at14.59.26.png',20,'boy','2019-07-19 10:10:59',418,'2019-07-19 10:10:59',0,1),
	(317,146,107,1,3,'skill-group','Cubs','http://api2.grassroots.hostings.co.uk/storage/teams/146/1563527801_pepsi.png',15,'boy','2019-07-19 10:16:41',424,'2019-07-19 10:16:41',0,1),
	(318,146,107,2,3,'skill-group','Tigers','http://api2.grassroots.hostings.co.uk/storage/teams/146/1563527928_Untitled-1.png',20,'boy','2019-07-19 10:18:48',424,'2019-07-19 10:18:48',0,1),
	(319,146,107,3,4,'skill-group','Rats','http://api2.grassroots.hostings.co.uk/storage/teams/146/1563527968_rats.jpg',20,'boy','2019-07-19 10:19:28',424,'2019-07-19 10:19:28',0,1),
	(320,146,107,1,3,'team','Cubs Team',NULL,13,'boy','2019-07-19 10:21:25',424,'2019-07-19 10:21:25',0,1),
	(321,146,107,2,3,'team','Tigers Team',NULL,13,'boy','2019-07-19 10:22:51',424,'2019-07-19 10:22:51',0,1),
	(322,146,107,3,4,'team','Team Rats',NULL,13,'boy','2019-07-19 10:23:59',424,'2019-07-19 10:23:59',0,1),
	(323,146,107,4,4,'skill-group','Camp Under 7s',NULL,21,'boy','2019-07-31 14:36:33',424,'2019-07-31 14:36:33',0,1),
	(324,146,107,7,5,'team','Stels Under10s',NULL,21,'boy','2019-07-31 14:39:19',424,'2019-07-31 14:39:19',0,1),
	(325,147,108,3,3,'skill-group','lions',NULL,12,'mixed','2019-07-31 17:38:44',433,'2019-07-31 17:38:44',0,1),
	(326,147,108,11,5,'skill-group','bears',NULL,20,'boy','2019-07-31 17:39:08',433,'2019-07-31 17:39:08',0,1),
	(327,145,105,16,4,'team','Lions',NULL,16,'boy','2019-08-27 10:24:13',418,'2019-08-27 10:24:13',418,1),
	(328,145,105,2,1,'skill-group','Team 1',NULL,10,'boy','2019-08-14 10:05:58',418,'2019-08-14 10:05:58',0,1),
	(329,145,105,2,1,'skill-group','team 2',NULL,10,'boy','2019-08-14 10:06:15',418,'2019-08-14 10:06:15',0,1),
	(330,145,105,12,2,'team','Test team',NULL,13,'boy','2019-08-20 12:06:48',418,'2019-08-20 12:06:48',0,1),
	(331,145,105,12,1,'team','Test 4',NULL,10,'mixed','2019-08-20 12:35:16',418,'2019-08-20 12:35:16',0,1),
	(332,145,105,12,1,'team','Test 6',NULL,13,'mixed','2019-08-20 14:36:43',418,'2019-08-20 14:36:43',0,1),
	(333,145,105,2,2,'skill-group','Snails',NULL,13,'mixed','2019-08-20 15:08:53',418,'2019-08-20 15:08:53',0,1),
	(334,145,105,2,1,'skill-group','Team Test P 6',NULL,13,'boy','2019-08-20 15:16:52',418,'2019-08-20 15:16:52',0,1),
	(335,145,105,12,2,'team','New team',NULL,13,'mixed','2019-08-20 15:28:40',418,'2019-08-20 15:28:40',0,1),
	(336,145,105,15,1,'team','Brazil',NULL,13,'girl','2019-08-20 15:37:00',418,'2019-08-20 15:37:00',0,1);

/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table term_condition
# ------------------------------------------------------------

DROP TABLE IF EXISTS `term_condition`;

CREATE TABLE `term_condition` (
  `tc_id` int(11) NOT NULL,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`tc_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table todo
# ------------------------------------------------------------

DROP TABLE IF EXISTS `todo`;

CREATE TABLE `todo` (
  `todo_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `venue_id` int(11) DEFAULT '0',
  `title` varchar(255) NOT NULL,
  `content` text,
  `is_public` tinyint(4) DEFAULT NULL,
  `send_email` tinyint(4) DEFAULT '0',
  `assignee` int(11) NOT NULL DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `completed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order` int(11) DEFAULT NULL,
  `status` enum('completed','pending','cancelled') NOT NULL DEFAULT 'pending',
  `user_roles` varchar(255) NOT NULL,
  PRIMARY KEY (`todo_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `todo` WRITE;
/*!40000 ALTER TABLE `todo` DISABLE KEYS */;

INSERT INTO `todo` (`todo_id`, `franchise_id`, `club_id`, `venue_id`, `title`, `content`, `is_public`, `send_email`, `assignee`, `date`, `start_time`, `end_time`, `created_at`, `created_by`, `updated_at`, `updated_by`, `completed_at`, `order`, `status`, `user_roles`)
VALUES
	(611,145,105,9176,'Clean Desk','Test clean desk',1,0,420,'2019-08-31 01:00:00','2019-08-31 04:40:00','2019-08-31 15:40:00','2019-07-05 17:52:56',418,'2019-08-29 12:58:18',418,'2019-07-05 17:52:56',NULL,'pending','coach,guardian,admin'),
	(612,146,107,NULL,'Clean the cones','Clean the yellow ones',1,0,424,'2019-07-21 01:00:00',NULL,NULL,'2019-07-19 11:13:32',424,'2019-07-19 11:13:32',424,'2019-07-19 11:13:32',0,'pending','coach'),
	(614,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2019-09-24 01:00:00',NULL,NULL,'2019-08-10 03:02:01',418,'2019-08-10 03:02:01',418,'2019-08-10 03:02:01',0,'pending','admin'),
	(616,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2019-11-24 00:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(617,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2019-12-24 00:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(618,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2020-01-24 00:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(619,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2020-02-24 00:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(620,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2020-03-24 00:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(621,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2020-04-24 01:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(622,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2020-05-24 01:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(623,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2020-06-24 01:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(624,145,105,NULL,'Cut the Grass on 11v11 pitch','call grass company 01234 565656 and arrange ',1,1,418,'2020-07-24 01:00:00',NULL,NULL,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',418,'2019-08-10 03:02:02',0,'pending','admin'),
	(628,145,105,9178,'Todo test 2','Some note',1,0,429,'2019-09-06 01:00:00','2019-09-06 17:30:00','2019-09-06 21:30:00','2019-08-21 15:41:21',418,'2019-08-21 16:59:33',418,'2019-08-21 15:41:21',NULL,'pending','coach'),
	(629,145,105,9180,'Clean Pitch','Some note',1,0,429,'2019-08-30 01:00:00','2019-08-30 11:00:00','2019-08-30 19:00:00','2019-08-21 17:04:58',418,'2019-08-21 17:04:58',418,'2019-08-21 17:04:58',0,'pending','guardian'),
	(630,145,105,9179,'Clean cantain','Make sure floor is clean',1,0,429,'2019-09-01 01:00:00','2019-09-01 23:00:00','2019-09-02 00:00:00','2019-08-22 15:32:27',418,'2019-08-22 15:32:27',418,'2019-08-22 15:32:27',0,'pending','admin'),
	(631,145,105,9179,'Clean cantain','Make sure floor is clean',1,0,429,'2019-09-08 01:00:00','2019-09-08 23:00:00','2019-09-09 00:00:00','2019-08-22 15:32:27',418,'2019-08-22 15:32:27',418,'2019-08-22 15:32:27',0,'pending','admin'),
	(632,145,105,9179,'Clean cantain','Make sure floor is clean',1,0,429,'2019-09-15 01:00:00','2019-09-15 23:00:00','2019-09-16 00:00:00','2019-08-22 15:32:27',418,'2019-08-22 15:32:27',418,'2019-08-22 15:32:27',0,'pending','admin'),
	(633,145,105,9179,'Clean cantain','Make sure floor is clean',1,0,429,'2019-09-22 01:00:00','2019-09-22 23:00:00','2019-09-23 00:00:00','2019-08-22 15:32:27',418,'2019-08-22 15:32:27',418,'2019-08-22 15:32:27',0,'pending','admin');

/*!40000 ALTER TABLE `todo` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table topic
# ------------------------------------------------------------

DROP TABLE IF EXISTS `topic`;

CREATE TABLE `topic` (
  `topic_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_guardian_blocked` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `is_featured` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`topic_id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;

INSERT INTO `topic` (`topic_id`, `franchise_id`, `club_id`, `title`, `content`, `is_guardian_blocked`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`, `is_featured`)
VALUES
	(1,146,107,'Coach Chat','Talkign about Coaching',0,'2019-07-19 11:29:52',424,'2019-07-19 11:29:52',0,0,0),
	(2,146,107,'General Chat','Anythign you wanna talk about here',0,'2019-07-19 11:18:52',424,'2019-07-19 11:18:52',0,0,0);

/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table transaction
# ------------------------------------------------------------

DROP TABLE IF EXISTS `transaction`;

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `programme_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `player_id` int(11) DEFAULT NULL,
  `type_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `code_id` int(11) NOT NULL,
  `type` enum('club','parent','coach') DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL,
  `gocardless_payment_id` varchar(120) DEFAULT NULL,
  `gocardless_status` enum('pending_customer_approval','pending_submission','submitted','confirmed','paid_out','cancelled','customer_approval_denied','failed','charged_back') DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(8,2) NOT NULL,
  `vat_rate` tinyint(2) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `register_type` enum('fee','credit','receipt') DEFAULT NULL,
  `company` enum('fc','academy') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`),
  KEY `account_id` (`account_id`),
  KEY `type_id` (`type_id`),
  KEY `user_id` (`user_id`),
  KEY `code_id` (`code_id`),
  KEY `gocardless_payment_id` (`gocardless_payment_id`),
  KEY `gocardless_status` (`gocardless_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='status: \n	Coach :\n		 3:  manual transition';

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;

INSERT INTO `transaction` (`id`, `franchise_id`, `club_id`, `account_id`, `programme_id`, `session_id`, `player_id`, `type_id`, `user_id`, `code_id`, `type`, `status`, `gocardless_payment_id`, `gocardless_status`, `date`, `amount`, `vat_rate`, `note`, `created_at`, `created_by`, `updated_at`, `updated_by`, `register_type`, `company`)
VALUES
	(20,145,106,0,NULL,NULL,NULL,0,417,0,'club',NULL,'PM000J4P5W4885','paid_out','2019-07-05 11:10:02',25.00,NULL,'Direct debit','2019-07-05 11:10:02',417,'2019-07-05 11:16:01',417,NULL,NULL),
	(21,146,107,0,NULL,NULL,218,0,428,0,'parent',NULL,NULL,'paid_out','2019-07-19 01:00:00',25.00,NULL,'cash','2019-07-19 12:20:17',424,'2019-07-19 12:20:17',424,'receipt',NULL),
	(22,145,106,0,NULL,NULL,NULL,0,417,0,'club',NULL,'PM000KB3GQ8TG6','paid_out','2019-08-04 12:52:02',25.00,NULL,'Direct debit','2019-08-04 12:52:02',417,'2019-08-12 10:58:02',417,NULL,NULL),
	(23,146,107,0,NULL,NULL,NULL,0,423,0,'club',NULL,'PM000M3GSMZV8B','paid_out','2019-08-18 09:48:02',25.00,NULL,'Direct debit','2019-08-18 09:48:02',423,'2019-08-27 10:52:01',423,NULL,NULL);

/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table transaction_code
# ------------------------------------------------------------

DROP TABLE IF EXISTS `transaction_code`;

CREATE TABLE `transaction_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table transaction_line
# ------------------------------------------------------------

DROP TABLE IF EXISTS `transaction_line`;

CREATE TABLE `transaction_line` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` int(11) unsigned NOT NULL,
  `package_id` int(11) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  `amount` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `package_id` (`package_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `transaction_line` WRITE;
/*!40000 ALTER TABLE `transaction_line` DISABLE KEYS */;

INSERT INTO `transaction_line` (`id`, `transaction_id`, `package_id`, `club_id`, `amount`, `created_at`, `updated_at`)
VALUES
	(17,20,39,106,10.00,'2019-07-05 11:10:02','2019-07-05 11:10:02'),
	(18,20,40,105,15.00,'2019-07-05 11:10:02','2019-07-05 11:10:02'),
	(19,22,39,106,10.00,'2019-08-04 12:52:02','2019-08-04 12:52:02'),
	(20,22,40,105,15.00,'2019-08-04 12:52:02','2019-08-04 12:52:02'),
	(21,23,41,107,25.00,'2019-08-18 09:48:02','2019-08-18 09:48:02');

/*!40000 ALTER TABLE `transaction_line` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table transaction_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `transaction_type`;

CREATE TABLE `transaction_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `franchise_id` (`franchise_id`),
  KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `franchise_id` int(11) NOT NULL,
  `club_id` int(11) DEFAULT '0',
  `user_role` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `api_key` varchar(255) NOT NULL,
  `access_level` tinyint(4) NOT NULL DEFAULT '0',
  `password` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `dob` timestamp NULL DEFAULT NULL,
  `mobile` varchar(30) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `emergency_number` varchar(30) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `town` varchar(255) DEFAULT NULL,
  `postcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `auto_send_skills_reports` tinyint(4) DEFAULT NULL,
  `password_reset` varchar(255) DEFAULT NULL,
  `has_active_players` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `welcome` tinyint(1) NOT NULL DEFAULT '1',
  `status` tinyint(4) DEFAULT '1',
  `partner_name` varchar(255) DEFAULT NULL,
  `partner_tel` varchar(255) DEFAULT NULL,
  `activation_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `activation_code` (`activation_code`),
  KEY `franchise_id` (`franchise_id`),
  CONSTRAINT `user_franchise_id` FOREIGN KEY (`franchise_id`) REFERENCES `franchise` (`franchise_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`user_id`, `franchise_id`, `club_id`, `user_role`, `email`, `api_key`, `access_level`, `password`, `pic`, `first_name`, `last_name`, `display_name`, `dob`, `mobile`, `telephone`, `emergency_number`, `address_id`, `address`, `address2`, `town`, `postcode`, `auto_send_skills_reports`, `password_reset`, `has_active_players`, `last_login`, `created_at`, `updated_at`, `welcome`, `status`, `partner_name`, `partner_tel`, `activation_code`)
VALUES
	(1,0,0,5,'alex@xanda.net','',0,'$2y$10$oaQsHhACo/mZgsKaPOW1BOGUTn8.W19uGzeyc8YyBT00iaudOQRs.',NULL,'Alex','Xanda','Alexander N. Constantine',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'skcBfF1ovIP1mPFzvXlh49WI3bTPTk1FgpscyQRjIivVT25iKCj9fLUsKL2m5EICdw2FbvfemvRn0Dq01520424058',1,'2018-03-07 12:00:58','0000-00-00 00:00:00','2019-07-05 09:35:32',1,1,NULL,NULL,NULL),
	(2,4,0,4,'raul@xanda.net','7w6pOBUFdorfsEkkJithVwWFW4bIPz0BECXoBa27jljr7NinDpsE99Jv0lPFjUE5OloIEoYpRPR9gJXy1504023823',0,'$2y$10$GW3T11Pjvw8evYiC8q6gXejJ.3IjY.cIq6T8HXrZMeecbaBXn3Jk2',NULL,'RaullAAA','Brindus','RaullAAA Brindus',NULL,'121212312','07707401534',NULL,NULL,'94-96 Great North Road','address ','London',X'4E3220304E',NULL,NULL,0,'2019-03-20 15:36:55','2017-08-29 17:23:44','2019-05-17 12:30:19',1,1,NULL,NULL,NULL),
	(417,145,0,4,'asdasd@asdasd.com','8C686RP2wpElIKmz3u23uJzwkHunyfzJTO38bol8mi1kSiBj6hEeGyUNJmw8EDA6g5FeLLHQn6RzHSee1562317901',0,'$2y$10$T3PMAj6TnuOAWtASUHcQ/e.BU0l8buGx/lFO4P.Dpy7SpHpxx3Evm',NULL,'FirstName','Xanda123','FirstName Xanda123',NULL,' 0795 482 1350','07481288292',NULL,NULL,'asd','Square','asd',X'6E773320337172',NULL,NULL,1,'2019-07-05 10:11:41','2019-07-05 10:11:41','2019-08-29 13:01:47',1,1,NULL,NULL,NULL),
	(418,145,105,1,'kamrul@xanda.net','aMUa5Mew43rTWAhOPNge212YWIQMi2TNRZo8qybOlSuGFIpJZu7he9VlWVfkPsYtjV2yK8x5baF8fImY1562320560',0,'$2y$10$T3PMAj6TnuOAWtASUHcQ/e.BU0l8buGx/lFO4P.Dpy7SpHpxx3Evm',NULL,'Kamrul','Ahmed','Kamrul Ahmed',NULL,'null','01622296755',NULL,NULL,'Bound green, 75 evesham road, 75 evesham road, null','null','Wood green',X'4E313120325252',NULL,NULL,1,'2019-07-05 10:56:00','2019-07-05 10:56:00','2019-08-29 12:25:45',1,1,NULL,NULL,NULL),
	(419,145,106,1,'kamrul@xanda.net','7Z4jTzYsZ2FKjfOtEgO2fVrU6Rl3Z063hETAvrb3xctNiiD3erG3htUWCpRWxHd4QIVFIIWw2Hme0yK11562321061',0,'$2y$10$T3PMAj6TnuOAWtASUHcQ/e.BU0l8buGx/lFO4P.Dpy7SpHpxx3Evm',NULL,'kamrul','ahmed','Kamrul Ahmed',NULL,NULL,'01622296755',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-07-05 11:04:21','2019-07-05 11:04:21','2019-07-08 09:57:47',1,1,NULL,NULL,NULL),
	(420,145,105,2,'unai@xanda.net','FfREebsPV1RmRbQNYZV7IAk4Xpy9GZ1H1YRxWDWHK02IQDo5SOrjkQw6SS9wkfsvrqDYVvDJrQnUACnh1562322869',0,'$2y$10$drHejQ6BZOy7Kq0y9b/0munz0H6HQZcwQh7sxB2ONST3H4PXlspmu','http://api2.grassroots.hostings.co.uk/storage/coaches/145/1562322869_bigstock-VALENCIA-SPAIN-JANUARY-81353933-Unai-Emery-400x267.jpg','Unai','Emery Etxegoien','Unai Emery Etxegoien','1971-11-11 00:00:00','098765432','123456789',NULL,9154,'Spain',NULL,'Hondarribia',X'4947313120394150',1,NULL,1,'2019-07-05 11:34:29','2019-07-05 11:34:29','2019-07-08 09:58:57',1,1,NULL,NULL,NULL),
	(421,145,105,3,'dan@xanda.net','cvjzSvhIy26OQ2C0SrGWpch5ZoI1xBbiIzXcvwYxRJItQB3o4BYbLkXpKeVjpyoFEzwkbym7bDKqQYaz1562328918',0,'$2y$10$11KeGWMU969mbStMWFge9uu20VZlIsFNokwgm89qaSxnUzPbZZYCq',NULL,'Dan','Joe test','Dan Joe test',NULL,'07700 900000','08081 570000','08081 570000',9156,'75 Evesham road',NULL,'undefinedwwwwwwwwwwwwwwwwwww',X'4E313120325252',NULL,NULL,1,'2019-07-05 13:15:18','2019-07-05 13:15:18','2019-08-29 12:06:54',1,1,'Magrate','08081 570000',NULL),
	(422,145,105,3,'parent@xanda.net','H3IFEwenO4jJqS8MXhzROVRwIAoQt5jB7Z2pqx09ZVPTfmu9XGWOLPI6G2iY9MXx0xeMXiDxrsMXmvrZ1562583413',0,'$2y$10$0FzJZhBxcZhxEYF9V8pPdugJtzBWSIeOcR6qqxox2mun6WpHUGxwy',NULL,'PAarent','Kane','PAarent Kane',NULL,'07878787887','02087878787','',9157,'',NULL,'testing123',X'616161',NULL,NULL,1,'2019-07-08 11:56:54','2019-07-08 11:56:54','2019-08-29 12:02:29',1,1,'null','null',NULL),
	(423,146,0,4,'daniel@xanda.net','GWAE84dVe15P3GBJA2XSC6ozg5FWB76Fii9iRV6QNdtSsBs6opiP59Rt3izRpaWIi7EsgD8cNla7MiWl1563526026',0,'$2y$10$mm2cy0auHzGPabb7GBmiDOODO0oGo4s0o/KM2iOIk343HypIIhCD.',NULL,'Daniel','Levy','Daniel Levy',NULL,'0795555555','02085555555',NULL,NULL,'100 Tottenham High Road','Tottenham','London',X'4E323020313233',NULL,NULL,1,'2019-07-19 09:47:07','2019-07-19 09:47:07','2019-07-19 09:47:07',1,1,NULL,NULL,NULL),
	(424,146,107,1,'poch@xanda.net','DPs37amKGJkUrAsggQcqJj0pRwcMleqTscp9MgZun15LVhfqrVe0KJhLZoUTRjjXzmYQUh6uEOwi8W401563526472',0,'$2y$10$XgELPg15N9okbxW2sCm2bOHdqqniDWv5Obo4U/j1z6.msTItWjKoG',NULL,'Mauricio','Pochatino','Mauricio Pochatino',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-07-19 09:54:32','2019-07-19 09:54:32','2019-07-19 09:56:04',0,1,NULL,NULL,NULL),
	(425,146,107,1,'daniel@xanda.net','l8jepHWlOAlvcdQJN2gmiGhjJCyjTq37l9CshjIjTvuCXLCwtZMkMJFM66Zv32gVEZxbxNAWALO3Z9Ev1563526475',0,'$2y$10$mm2cy0auHzGPabb7GBmiDOODO0oGo4s0o/KM2iOIk343HypIIhCD.',NULL,'Daniel','Levy','Daniel Levy',NULL,NULL,'02085555555',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-07-19 09:54:35','2019-07-19 09:54:35','2019-07-19 09:54:35',1,1,NULL,NULL,NULL),
	(426,146,107,2,'ossie@xanda.net','2kY0KVHUvpofNHft7sTkDJJz1h7seFmjw7rxaYUglGk0EhdUnSHR6uQ85NGeBbKoiFxZgBh4dLbLyXGZ1563527776',0,'$2y$10$JwhbyDFGKK4mjUll3eTD0u0AuEfJRf1gnm2ZdqE1d99vE/9g4Lkoy','http://api2.grassroots.hostings.co.uk/storage/coaches/146/1563527776_ossie.jpg','Osvaldo ','Ardiles','Osvaldo  Ardiles','1978-07-05 01:00:00','07878787889','0789878788',NULL,9160,'96 Great North Road',NULL,'Buenas Aires',X'41524720313233',1,NULL,1,'2019-07-19 10:16:16','2019-07-19 10:16:16','2019-07-19 11:31:59',1,1,NULL,NULL,NULL),
	(427,146,107,2,'glenn@xanda.net','wMPtlfk89KAIZFkjqSQes9A0De7Aq2yvBoxgkbEDgphzaXOXjcFbFtdNex3YHehAl56bvp0w8OO4tWZM1563533157',0,'$2y$10$MR07.QJbt1jkv0jYmnnnc.IqEH95IiuJ1F23QNqft11jUKqDG1272','http://api2.grassroots.hostings.co.uk/storage/coaches/146/1563533157_glenn.jpg','Glenn','Hoddle','Glenn Hoddle','0000-00-00 00:00:00',NULL,'02085555555',NULL,9164,'100 Tottenham High Road, Tottenham',NULL,'London',X'4E323020313233',1,NULL,1,'2019-07-19 11:45:57','2019-07-19 11:45:57','2019-07-19 11:45:57',1,1,NULL,NULL,NULL),
	(428,146,107,3,'daddy@xanda.net','l8jepHWlOAlvcdQJN2gmiGhjJCyjTq37l9CshjIjTvuCXLCwtZMkMJFM66Zv32gVEZxbxNAWALO3Z9Ev1563526475',0,'$2y$10$mm2cy0auHzGPabb7GBmiDOODO0oGo4s0o/KM2iOIk343HypIIhCD.',NULL,'Daddy','Kane','Daddy Kane',NULL,'0789707987','020887878979','',9165,'',NULL,'undefined',X'',NULL,NULL,0,'2019-07-19 12:01:01','2019-07-19 12:01:01','2019-07-22 10:08:07',1,1,'Mumm Kane','0789079873',NULL),
	(429,145,105,2,'coach@shazz.net','GHC07JWYpRLfKXbSeoYuyZQqX3Cm455dlBt2fDX0teoDtkXMW3Bf2xnJiiAogFjC0vATbYDq2jyjoaTx1563546563',0,'$2y$10$xpPO9kaPgezsvOGKDAqsCu3hofXls7oVBme0Ju/3jzRvtELXnQcby','http://api2.grassroots.hostings.co.uk/storage/coaches/145/1563546563_shaz-200x200.jpg','Shazz','Ahmed','Shazz Ahmed','1988-04-22 01:00:00','01622296755','01622296755',NULL,9166,'45 Romford road',NULL,'Whitechaple',X'453120364548',1,NULL,1,'2019-07-19 15:29:23','2019-07-19 15:29:23','2019-08-27 11:28:42',1,1,NULL,NULL,NULL),
	(430,147,0,4,'icecube@icecube.com','vRhKGtJJGHJf4QooJ8MYCsMGtMYkWbCjUNXIRk0rfO2ytFuC6UaupCa9wROBauiQwBc7ECcQzV2QjxE01564590474',0,'$2y$10$aMUCL0cqj0pugaIJxc5ZgO8yHPhqR.7urpaaCa/oA6StXkviMOIGm',NULL,'Ice','Cube','Ice Cube',NULL,'','5551234',NULL,NULL,'187 South Central St','','Compton',X'4E313420355246',NULL,NULL,1,'2019-07-31 17:27:54','2019-07-31 17:27:54','2019-07-31 17:27:54',1,1,NULL,NULL,NULL),
	(431,148,0,4,'icecube@cube.com','Zm4C4vZVAKcxK45OkUmYvjzVjd0MPxBFBdLm7GB97pmnF8qKKia8ELXs3KPlXRJ6ZkxfakByb8EkYouf1564590508',0,'$2y$10$ki28DJk1vWsdYI9FrCmuw.y/mJsuESFU4CW54kobTNtkNvLEP3zI.',NULL,'Ice','Cube','Ice Cube',NULL,'','5551234',NULL,NULL,'187 South Central St','','Compton',X'4E313420355246',NULL,NULL,1,'2019-07-31 17:28:28','2019-07-31 17:28:28','2019-07-31 17:28:28',1,1,NULL,NULL,NULL),
	(432,147,108,1,'drdre@icecube.com','TWSSCH5dXj60xHnnLVIWeKxK6PxRdX9hmn0EgPqvx8yfiCzfmab5tEPEc2O5OOB2sXyKYHGWhVPXtjpe1564590886',0,'$2y$10$HldgQrkZ6BFObAays9SD5uPgkPvfu8w3f9JkhWr7FSDyvFyOtAsrq',NULL,'Dr','Dre','Dr Dre',NULL,NULL,'55543251',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-07-31 17:34:46','2019-07-31 17:34:46','2019-07-31 17:34:46',1,1,NULL,NULL,NULL),
	(433,147,108,1,'icecube@icecube.com','txZPZcP9IRM2JDybilYUdPk38EC6bB44pnJgb0E6zjhTKSxhpiCYwnv4yuYdfVZCVg6UzBzsEVt6la1k1564590888',0,'$2y$10$aMUCL0cqj0pugaIJxc5ZgO8yHPhqR.7urpaaCa/oA6StXkviMOIGm',NULL,'Ice','Cube','Ice Cube',NULL,NULL,'5551234',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-07-31 17:34:48','2019-07-31 17:34:48','2019-07-31 17:34:48',1,1,NULL,NULL,NULL),
	(436,145,111,1,'kamrul@xanda.net','dA6RdLsQS2wXaSmnFhmKNqlXr4BkUkZfErtVaRYdjKCLi41KhAkCoEEdUhpkMWqdpniWfmHng9uHjjFM1565772929',0,'$2y$10$T3PMAj6TnuOAWtASUHcQ/e.BU0l8buGx/lFO4P.Dpy7SpHpxx3Evm',NULL,'kamrul','ahmed','kamrul ahmed',NULL,NULL,'01622296755',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-14 09:55:29','2019-08-14 09:55:29','2019-08-14 09:55:29',1,1,NULL,NULL,NULL),
	(437,145,105,2,'alexferguson@xanda.net','9UZfwxWOJmJ89RLCnjHO1oHKQaxWJLE3NY0XLpumyzO13Xy0o6DHqqNbCf4ex1fhWlltNQnXKg5A4pEZ1565784645',0,'$2y$10$Dd8IXcb6nxlgLfbsT8FenOY/ghEFujQbW2lKw0ruMME72gLPJm8xi','http://api2.grassroots.hostings.co.uk/storage/coaches/145/1565784645_GettyImages-1143459295-beca.jpg','Alex','Ferguson','Alex Ferguson','0000-00-00 00:00:00','07896543215','12345678909',NULL,9172,'UK',NULL,'Endfield',X'4E313120325252',1,NULL,1,'2019-08-14 13:10:45','2019-08-14 13:10:45','2019-08-14 13:10:45',1,1,NULL,NULL,NULL),
	(438,149,0,4,'daryan@xanda.net','r1rQDNGUUYRgcxsyNWkRwj7fe2Ammm4jtb3Y2LlchZtOrsVMjWid7m7XBWQuYRGVyZNdt1ZGZwOp8uXW1566466334',0,'$2y$10$HEURAoR1SloSxVfH6J9B0.yCKgCa55c/bZsgic0WEdpTBseBXC0yC',NULL,'Daryan','Amin','Daryan Amin',NULL,'','07481822797',NULL,NULL,'North london','','London',X'6E32206E3933',NULL,NULL,1,'2019-08-22 10:32:14','2019-08-22 10:32:14','2019-08-22 10:32:14',1,1,NULL,NULL,NULL),
	(439,149,112,1,'daryan@xanda.net','0op1JbH3vUI2Q3qlJ10NLCsFqNF0sL049aGCmC7PKDor7IuLybEWynL7K0ouveO6wNdbKC0MGHnBPtDr1566466733',0,'$2y$10$HEURAoR1SloSxVfH6J9B0.yCKgCa55c/bZsgic0WEdpTBseBXC0yC',NULL,'Daryan','Amin','Daryan Amin',NULL,NULL,'07481822797',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-22 10:38:53','2019-08-22 10:38:53','2019-08-22 10:38:53',1,1,NULL,NULL,NULL),
	(440,149,112,3,'parents@xanda.net','ijcXEjSiW98vbHZAc3KPx5LGpRX7yCKfNvVd9NL6HEdEaB8mrWQrFEZM10e6fL318cjuFNhWIjPMQF8i1566466956',0,'$2y$10$IHApf1iDu3e9DkVqRUouqOfqiMIOam89tL11DXIw1wYfin8oz4gAa',NULL,'Parent','Parent','parent parent',NULL,'07481822797','','',9182,'',NULL,'undefined',X'',NULL,NULL,0,'2019-08-22 10:42:36','2019-08-22 10:42:36','2019-08-22 10:42:36',1,1,NULL,NULL,NULL),
	(441,149,112,2,'coach2@xanda.net','osHNUQNZFEogLNBjY2czn60uW8Aj2DB707UPaA7cDDvmcoQr84sKvCFhID13SIy7Oqbygs2Et1aIOAzY1566467248',0,'$2y$10$BLFzvYdCsHWbAghdXSN0ve1iiz91SxOfcy.qlRnZGO.zMmlFA5DGG','http://api2.grassroots.hostings.co.uk/storage/coaches/149/1566467248_FHMM4RQZYVEGTPQCBOKP2PGKIM.jpg','coach','coach','coach coach','1997-08-21 01:00:00','07481822797','07481822797',NULL,9183,'north london',NULL,'london',X'6E323220723333',1,NULL,1,'2019-08-22 10:47:28','2019-08-22 10:47:28','2019-08-22 10:47:28',1,1,NULL,NULL,NULL),
	(442,150,0,4,'test@xanda.net','3hqEtgP0wjEaoznFtOkzRON7KvZ22dPQcSUtUZO3mZYcF2ZTeCJdcUYBXnrsstDfgTAafvegyQYbr0CO1566555435',0,'$2y$10$Fu0IQxcX10VlnAqd2yIOl.BkiJTpCK9FTqqw30N4UmxO74FPoj/Qa',NULL,'Test','Test','Test Test',NULL,'128238729','012381289',NULL,NULL,'test road','test','test',X'6E773420347171',NULL,NULL,1,'2019-08-23 11:17:15','2019-08-23 11:17:15','2019-08-23 11:17:15',1,1,NULL,NULL,NULL),
	(443,150,113,1,'test@xanda.net','mtA4B47SBFLytLotSQPe9hgQ4qzRetGLDXuvoTXJEdYWGbw4VUlInHShrbgLiwe12YrmFYfKQoTu9hiI1566555926',0,'$2y$10$Fu0IQxcX10VlnAqd2yIOl.BkiJTpCK9FTqqw30N4UmxO74FPoj/Qa',NULL,'Test','Test','Test Test',NULL,NULL,'012381289',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-23 11:25:26','2019-08-23 11:25:26','2019-08-23 11:25:26',1,1,NULL,NULL,NULL),
	(444,149,114,1,'daryan@xanda.net','1YfPZxpnbtfLTJsJjcUjD7YGLzhKggzJuAcENoo44TAy1BsSKTm0kCS6xQ0aqfKm6OjU7mvfE2hmefFY1566571476',0,'$2y$10$HEURAoR1SloSxVfH6J9B0.yCKgCa55c/bZsgic0WEdpTBseBXC0yC',NULL,'Daryan','Amin','Daryan Amin',NULL,NULL,'07481822797',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-23 15:44:36','2019-08-23 15:44:36','2019-08-23 15:44:36',1,1,NULL,NULL,NULL),
	(445,149,115,1,'daryan@xanda.net','pw7m2CMeYEEMhyZkpqDpM4x4BD29uMVZNfgIM0zQTJRBvalUiE19KRVOnMW8EHSR3pmh8Td4oMNiSnSX1566571789',0,'$2y$10$HEURAoR1SloSxVfH6J9B0.yCKgCa55c/bZsgic0WEdpTBseBXC0yC',NULL,'Daryan','Amin','Daryan Amin',NULL,NULL,'07481822797',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-23 15:49:49','2019-08-23 15:49:49','2019-08-23 15:49:49',1,1,NULL,NULL,NULL),
	(446,149,116,1,'daryan@xanda.net','uLKlNhAALDH705IBBOwP3SAkROxRbbvXAMgKjpehRGk0FR7GyPNQeQwhwlfOsSbqhQhZzw1et7L0QQDn1566571836',0,'$2y$10$HEURAoR1SloSxVfH6J9B0.yCKgCa55c/bZsgic0WEdpTBseBXC0yC',NULL,'Daryan','Amin','Daryan Amin',NULL,NULL,'07481822797',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-23 15:50:36','2019-08-23 15:50:36','2019-08-23 15:50:36',1,1,NULL,NULL,NULL),
	(447,149,117,1,'daryan@xanda.net','5AFhlhJqaB4yjJZ1oiIfzQVECZASXvIq9Fb4Mrpy9Bs5wafUXDkoSuk6rauuJfbsYwIs27dRWhtpJDnH1566571890',0,'$2y$10$HEURAoR1SloSxVfH6J9B0.yCKgCa55c/bZsgic0WEdpTBseBXC0yC',NULL,'Daryan','Amin','Daryan Amin',NULL,NULL,'07481822797',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-23 15:51:30','2019-08-23 15:51:30','2019-08-23 15:51:30',1,1,NULL,NULL,NULL),
	(448,149,118,1,'daryan@xanda.net','Ng6ESS3BNvsIcMGlnYkqx7WPVC7nUH3IILedPy3QwbWSIDTZk8h2MUdIoqcqm6tbbucDTbBzN2QxvRN81566572534',0,'$2y$10$HEURAoR1SloSxVfH6J9B0.yCKgCa55c/bZsgic0WEdpTBseBXC0yC',NULL,'Daryan','Amin','Daryan Amin',NULL,NULL,'07481822797',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-23 16:02:14','2019-08-23 16:02:14','2019-08-23 16:02:14',1,1,NULL,NULL,NULL),
	(449,149,119,1,'daryan@xanda.net','uMgLPBaRAKAhWV83jG6KtBflnZUXWHJkMBe7z1bOI2szTuj2P62Ulomlt1PIu3asImoDklkHdTUa9FBI1566572778',0,'$2y$10$HEURAoR1SloSxVfH6J9B0.yCKgCa55c/bZsgic0WEdpTBseBXC0yC',NULL,'Daryan','Amin','Daryan Amin',NULL,NULL,'07481822797',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2019-08-23 16:06:18','2019-08-23 16:06:18','2019-08-23 16:06:18',1,1,NULL,NULL,NULL);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
