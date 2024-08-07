import { Router } from "express";
import {
    checkAvailability,
    getListingCount,
    getListingInfo,
    getListings,
    searchListings,
    syncHostAwayListing
} from "../controllers/listing.controller.js";
import { validateQuery } from "../middlewares/validation.js";
import { checkAvailabilitySchema, getAvailableListingsSchema, getListingSchema } from "../validationSchema/listing.js";
const router = Router();

router.route('/synclisting').get(syncHostAwayListing);

router.route('/').get(validateQuery(getListingSchema), getListings);

router.route('/count').get(getListingCount);

router.route('/getlistinginfo/:listingId').get(getListingInfo);

router.route('/getavailablelistings').get(validateQuery(getAvailableListingsSchema), searchListings);

router.route('/checkavailability').get(validateQuery(checkAvailabilitySchema), checkAvailability);

export default router;