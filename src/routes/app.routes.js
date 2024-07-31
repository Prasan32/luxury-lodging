import { Router } from "express";
import listingRoutes from "./listing.routes.js";
import contactRoutes from "./contact.routes.js";
const router = Router();

router.use('/listing', listingRoutes);
router.use('/contact', contactRoutes);

export default router;