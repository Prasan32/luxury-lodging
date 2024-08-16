import { Router } from "express";
import listingRoutes from "./listing.routes.js";
import contactRoutes from "./contact.routes.js";
import paymentRoutes from "./payment.routes.js";
import reviewRoutes from "./review.routes.js";
const router = Router();

router.use('/listing', listingRoutes);
router.use('/contact', contactRoutes);
router.use('/payment', paymentRoutes);
router.use('/review', reviewRoutes);

export default router;