import { Router } from "express";
import { createCustomer, createPaymentIntent, savePaymentInfo } from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validation.js";
import { createCustomerSchema, createPaymentIntentSchema, savePaymentInfoSchema } from "../validationSchema/payment.js";
const router = Router();

router.route('/createpaymentintent').post(validate(createPaymentIntentSchema), createPaymentIntent);

router.route('/createcustomer').post(validate(createCustomerSchema), createCustomer);

router.route('/savepaymentinfo').post(validate(savePaymentInfoSchema), savePaymentInfo)

export default router;