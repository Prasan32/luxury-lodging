import createHttpError from "http-errors";
import HostAwayClient from "../clients/hostaway.js";
import Listing from "../models/Listing.js";
import logger from "../config/winstonLoggerConfig.js";

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
    const newListingObjects = newListings.map((obj) => createListingObject(obj));

    await Listing.bulkCreate(newListingObjects);
    logger.info("Listings synced successfully");
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

const getListings = async () => {
    const listings = await Listing.findAll();
    return listings;
}

const getListingInfo = async (listingId) => {
    const listing = await Listing.findByPk(listingId);
    if (!listing) {
        throw new createHttpError(404, `Listing with id ${listingId} not found`);
    }
    return listing;
}

const listingService = {
    syncHostAwayListing,
    getListings,
    getListingInfo
};

export default listingService;