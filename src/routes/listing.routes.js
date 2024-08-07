import { Router } from "express";
import {
    calculatePrice,
    checkAvailability,
    getListingCount,
    getListingInfo,
    getListings,
    searchListings,
    syncHostAwayListing
} from "../controllers/listing.controller.js";
import { validate, validateQuery } from "../middlewares/validation.js";
import { calculatePriceSchema, checkAvailabilitySchema, getAvailableListingsSchema, getListingSchema } from "../validationSchema/listing.js";
const router = Router();

router.route('/synclisting').get(syncHostAwayListing);

router.route('/').get(validateQuery(getListingSchema), getListings);

router.route('/count').get(getListingCount);

router.route('/getlistinginfo/:listingId').get(getListingInfo);

router.route('/getavailablelistings').get(validateQuery(getAvailableListingsSchema), searchListings);

router.route('/checkavailability').get(validateQuery(checkAvailabilitySchema), checkAvailability);

router.route('/calculateprice').post(validate(calculatePriceSchema), calculatePrice);

export default router;