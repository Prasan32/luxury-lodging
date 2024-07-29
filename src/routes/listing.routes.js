import { Router } from "express";
import { getListingInfo, getListings, syncHostAwayListing } from "../controllers/listing.controller.js";
const router = Router();

router.route('/synclisting').get(syncHostAwayListing);

router.route('/').get(getListings);

router.route('/:listingId').get(getListingInfo)

export default router;