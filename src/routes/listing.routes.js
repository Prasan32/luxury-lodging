import { Router } from "express";
import {
    calculatePrice,
    checkAvailability,
    getListingCount,
    getListingInfo,
    getListings,
    getCalendar,
    searchListings,
    syncHostAwayListing,
    getAmenities,
    getCountries,
    getDiscountPrice,
    getLocationList,
    getLocation
} from "../controllers/listing.controller.js";
import { validate, validateQuery } from "../middlewares/validation.js";
import { calculatePriceSchema, checkAvailabilitySchema, searchListingsSchema, getListingSchema, getCalendarSchema, getDiscountPriceSchema } from "../validationSchema/listing.js";
const router = Router();

router.route('/synclisting').get(syncHostAwayListing);

router.route('/').get(validateQuery(getListingSchema), getListings);

router.route('/count').get(getListingCount);

router.route('/getlistinginfo/:listingId').get(getListingInfo);

router.route('/searchlistings').post(validate(searchListingsSchema), searchListings);

router.route('/checkavailability').get(validateQuery(checkAvailabilitySchema), checkAvailability);

router.route('/calculateprice').post(validate(calculatePriceSchema), calculatePrice);

router.route('/getcalendar/:listingId').get(validateQuery(getCalendarSchema), getCalendar);

router.route('/amenities').get(getAmenities);

router.route('/getcountries').get(getCountries);

router.route('/getdiscountprice').get(validateQuery(getDiscountPriceSchema), getDiscountPrice);

router.route('/getlocationlist').get(getLocationList)

router.route('/getlocation').get(getLocation)

export default router;