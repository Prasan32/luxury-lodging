import { Router } from "express";
import { getListings, syncHostAwayListing } from "../controllers/listing.controller.js";
const router = Router();

router.route('/synclisting').get(syncHostAwayListing);

router.route('/').get(getListings);

export default router;