import { Router } from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validation.js";
import { createPaymentIntentSchema } from "../validationSchema/payment.js";
const router = Router();

router.route('/createpaymentintent').post(validate(createPaymentIntentSchema), createPaymentIntent);

export default router;