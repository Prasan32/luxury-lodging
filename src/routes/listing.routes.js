import { Router } from "express";
import { syncHostAwayListing } from "../controllers/listing.controller.js";
const router = Router();

router.route('/synclisting').get(syncHostAwayListing);

export default router;