import { Router } from "express";
import listingRoutes from "./listing.routes.js";
const router = Router();

router.use('/listing', listingRoutes);

export default router;