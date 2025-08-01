CREATE TABLE `listing` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `propertyType` varchar(255) DEFAULT 'NOT SPECIFIED',
  `externalListingName` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `guestsIncluded` int DEFAULT NULL,
  `personCapacity` int DEFAULT NULL,
  `priceForExtraPerson` float DEFAULT NULL,
  `currencyCode` varchar(255) DEFAULT NULL,
  `internalListingName` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `countryCode` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `zipCode` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `checkInTimeStart` int DEFAULT NULL,
  `checkInTimeEnd` int DEFAULT NULL,
  `checkOutTime` int DEFAULT NULL,
  `wifiUsername` varchar(255) DEFAULT NULL,
  `wifiPassword` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `roomType` varchar(255) DEFAULT NULL,
  `bathroomType` varchar(255) DEFAULT NULL,
  `bedroomsNumber` int DEFAULT NULL,
  `bedsNumber` int DEFAULT NULL,
  `bathroomsNumber` int DEFAULT NULL,
  `houseRules` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `listing_image` (
  `id` int NOT NULL,
  `listingId` int NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `vrboCaption` varchar(255) DEFAULT NULL,
  `airbnbCaption` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `sortOrder` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `listing_image_ibfk_1` FOREIGN KEY (`listingId`) REFERENCES `listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `listing_amenity` (
  `id` int NOT NULL,
  `listingId` int NOT NULL,
  `amenityId` int DEFAULT NULL,
  `amenityName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `listingId` (`listingId`),
  CONSTRAINT `listing_amenity_ibfk_1` FOREIGN KEY (`listingId`) REFERENCES `listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `payment_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guestName` varchar(255) DEFAULT NULL,
  `guestEmail` varchar(255) DEFAULT NULL,
  `guestPhone` varchar(255) DEFAULT NULL,
  `listingId` int DEFAULT NULL,
  `checkInDate` varchar(255) DEFAULT NULL,
  `checkOutDate` varchar(255) DEFAULT NULL,
  `guests` int DEFAULT NULL,
  `adults` INT DEFAULT NULL,
  `children` INT DEFAULT NULL,
  `infants` INT DEFAULT NULL,
  `pets` INT DEFAULT NULL,
  `paymentIntentId` varchar(255) DEFAULT NULL,
  `customerId` varchar(255) DEFAULT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `paymentStatus` varchar(255) DEFAULT NULL,
  `reservationId` varchar(255) DEFAULT NULL,
  `chargeId` varchar(255) DEFAULT NULL,
  `couponName` varchar(255) DEFAULT NULL,
  `orderId`  varchar(255) NOT NULL UNIQUE, 
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
-- ALTER TABLE `payment_info` ADD COLUMN `orderId` varchar(255) NOT NULL UNIQUE;

-- ALTER TABLE `payment_info` ADD COLUMN `adults` INT DEFAULT NULL;
-- ALTER TABLE `payment_info` ADD COLUMN `children` INT DEFAULT NULL;
-- ALTER TABLE `payment_info` ADD COLUMN `infants` INT DEFAULT NULL;
-- ALTER TABLE `payment_info` ADD COLUMN `pets` INT DEFAULT NULL;

CREATE TABLE `subscriber` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);


CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listingId` INT NOT NULL,
  `review` TEXT NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `city_state_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(255) NOT NULL,
  `state_id` VARCHAR(255) NOT NULL,
  `state_name` VARCHAR(255) NOT NULL,
  `lat` VARCHAR(255) NOT NULL,
  `lng` VARCHAR(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Index for state_id
CREATE INDEX idx_state_id ON city_state_info(state_id);

-- Index for state_name
CREATE INDEX idx_state_name ON city_state_info(state_name);
