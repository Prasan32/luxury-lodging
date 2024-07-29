import listingService from "../services/listing.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const syncHostAwayListing = asyncHandler(async (req, res, next) => {
    await listingService.syncHostAwayListing();
    res.status(200).json({ message: "Listings synced successfully" });
})

export const getListings = asyncHandler(async (req, res, next) => {
    const listings = await listingService.getListings();
    res.status(200).json(listings);
});