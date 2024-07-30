import createHttpError from "http-errors";
import HostAwayClient from "../clients/hostaway.js";
import { Listing, ListingImage, ListingAmenity } from "../models/index.js";
import logger from "../config/winstonLoggerConfig.js";
import sequelize from "../config/database.js";

const syncHostAwayListing = async () => {
    const listings = await HostAwayClient.getListings();

    if (!listings) {
        logger.error("Failed to fetch listings from Hostaway API");
        createHttpError(404, "Failed to fetch listings from Hostaway API");
    }

    const existingListings = await Listing.findAll();

    const newListings = listings.filter(
        (listing) => !existingListings.some((existingListing) => existingListing.id === listing.id)
    );

    if (newListings.length === 0) {
        logger.info("No new listings to sync with the database");
        return;
    }

    logger.info(`Syncing ${newListings.length} new listings from Hostaway API`);

    for (const newListingData of newListings) {
       
        await sequelize.transaction(async (t) => {
            const newListingObject = createListingObject(newListingData);

            const newListing = await Listing.create(newListingObject, { transaction: t });

            // Process and save listing images
            if (newListingData.listingImages && newListingData.listingImages.length > 0) {
                const imageObjects = newListingData.listingImages.map(image => createListingImageObject(image, newListing.id));
                await ListingImage.bulkCreate(imageObjects, { transaction: t });
            }

            //Process and save listing amenities
            if (newListingData.listingAmenities && newListingData.listingAmenities.length > 0) {
                const amenityObjects = newListingData.listingAmenities.map(amenity => createListingAmenityObject(amenity, newListing.id));
                await ListingAmenity.bulkCreate(amenityObjects, { transaction: t });
            }

            logger.info(`Listing ${newListing.id} and its images, amenities synced successfully`);
        }).catch((error) => {
            logger.error(`Error syncing listing ${newListingData.id}: ${error.message}`);
            throw error;
        });
    }

    logger.info("Listings and their images, amenities synced successfully");
    return;
};

const createListingObject = (data) => {
    return {
        id: data?.id,
        name: data?.name,
        description: data?.description,
        externalListingName: data?.externalListingName,
        address: data?.address,
        guests: data?.personCapacity,
        price: data?.price,
        guestsIncluded: data?.guestsIncluded,
        priceForExtraPerson: data?.priceForExtraPerson,
        currencyCode: data?.currencyCode,
        internalListingName: data?.internalListingName || "",
        country: data?.country || "",
        countryCode: data?.countryCode || "",
        state: data?.state || "",
        city: data?.city || "",
        street: data?.street || "",
        zipcode: data?.zipcode || "",
        lat: data?.lat || 0,
        lng: data?.lng || 0,
        propertyType: data?.bookingcomPropertyRoomName || "",
        checkInTimeStart: data?.checkInTimeStart || 0,
        checkInTimeEnd: data?.checkInTimeEnd || 0,
        checkOutTime: data?.checkOutTime || 0,
        wifiUsername: data?.wifiUsername || "(NO WIFI)",
        wifiPassword: data?.wifiPassword || "(NO PASSWORD)",
    };
};

const createListingImageObject = (image, listingId) => {
    return {
        id: image.id,
        listingId,
        caption: image.caption,
        vrboCaption: image.vrboCaption,
        airbnbCaption: image.airbnbCaption,
        url: image.url,
        sortOrder: image.sortOrder,
    };
};

const createListingAmenityObject = (amenity, listingId) => {
    return {
        id: amenity.id,
        listingId: listingId,
        amenityId: amenity.amenityId,
        amenityName: amenity.amenityName,
    };
};


const getListings = async () => {
    const listings = await Listing.findAll({
        include: [
            {
                model: ListingImage,
                as: 'images'
            },
            {
                model: ListingAmenity,
                as: 'amenities'
            }
        ]
    });
    return listings;
}

const getListingInfo = async (listingId) => {
    const listing = await Listing.findByPk(listingId,{
        include: [
            {
                model: ListingImage,
                as: 'images'
            },
            {
                model: ListingAmenity,
                as: 'amenities'
            }
        ]
    });
    return listing;
}

const listingService = {
    syncHostAwayListing,
    getListings,
    getListingInfo
};

export default listingService;