import { Router } from "express";
import {
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

router.route('/getlistinginfo/:listingId').get(getListingInfo);

router.route('/getavailablelistings').get(validateQuery(getAvailableListingsSchema), searchListings);

export default router;