import { Router } from "express";
import {
    getListingCount,
    getListingInfo,
    getListings,
    searchListings,
    syncHostAwayListing
} from "../controllers/listing.controller.js";
import { validateQuery } from "../middlewares/validation.js";
import { getAvailableListingsSchema } from "../validationSchema/listing.js";
const router = Router();

router.route('/synclisting').get(syncHostAwayListing);

router.route('/').get(getListings);

router.route('/count').get(getListingCount);

router.route('/getlistinginfo/:listingId').get(getListingInfo);

router.route('/getavailablelistings').get(validateQuery(getAvailableListingsSchema), searchListings);

export default router;