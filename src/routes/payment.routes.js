import { Router } from "express";
import { createCustomer, createPaymentIntent } from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validation.js";
import { createCustomerSchema, createPaymentIntentSchema } from "../validationSchema/payment.js";
const router = Router();

router.route('/createpaymentintent').post(validate(createPaymentIntentSchema), createPaymentIntent);

router.route('/createcustomer').post(validate(createCustomerSchema), createCustomer);

export default router;