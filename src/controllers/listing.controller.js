import listingService from "../services/listing.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const syncHostAwayListing = asyncHandler(async (req, res, next) => {
    await listingService.syncHostAwayListing();
    return res.status(200).json({ message: "Listings synced successfully" });
})

export const getListings = asyncHandler(async (req, res, next) => {
    const { limit, page, priceOrder } = req.query;
    const listings = await listingService.getListings(page, limit, priceOrder);
    return res.status(200).json(listings);
});

export const getListingCount = asyncHandler(async (req, res, next) => {
    const count = await listingService.getListingCount();
    return res.status(200).json({ count });
});

export const getListingInfo = asyncHandler(async (req, res, next) => {
    const listingId = req.params.listingId;
    const listing = await listingService.getListingInfo(listingId);

    if (!listing) {
        return res.status(404).json({ message: `Listing with id ${listingId} not found` });
    }

    return res.status(200).json(listing);
});

export const searchListings = asyncHandler(async (req, res, next) => {
    const { location, checkIn, checkOut, guests, priceOrder } = req.query;
    const listings = await listingService.searchListings(location, checkIn, checkOut, guests, priceOrder);
    return res.status(200).json(listings);
});

export const checkAvailability = asyncHandler(async (req, res, next) => {
    const { listingId, checkIn, checkOut } = req.query;
    const isAvailable = await listingService.checkAvailability(listingId, checkIn, checkOut);
    return res.status(200).json({ isAvailable });
});

export const calculatePrice = asyncHandler(async (req, res, next) => {
    const { listingId, checkIn, checkOut, guests } = req.body;
    const priceDetails = await listingService.calculatePrice(listingId, checkIn, checkOut, guests);
    return res.status(200).json(priceDetails);
});

export const getCalendar = asyncHandler(async (req, res, next) => {
    const { listingId } = req.params;
    const calendar = await listingService.getCalendar(listingId);
    return res.status(200).json(calendar);
});