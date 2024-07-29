import listingService from "../services/listing.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const syncHostAwayListing = asyncHandler(async (req, res, next) => {
    await listingService.syncHostAwayListing();
    return res.status(200).json({ message: "Listings synced successfully" });
})

export const getListings = asyncHandler(async (req, res, next) => {
    const listings = await listingService.getListings();
    return res.status(200).json(listings);
});

export const getListingInfo = asyncHandler(async (req, res, next) => {
    const listingId = req.params.listingId;
    const listing = await listingService.getListingInfo(listingId);

    if (!listing) {
        return res.status(404).json({ message: `Listing with id ${listingId} not found` });
    }

    return res.status(200).json(listing);
});