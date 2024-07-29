import logger from "../config/winstonLoggerConfig.js";
import listingService from "../services/listing.service.js";

export const syncHostAwayListing = async (req, res, next) => {
    try {
        await listingService.syncHostAwayListing();
        res.status(200).json({ message: "Listings synced successfully" });
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

