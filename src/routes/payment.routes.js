import { Router } from "express";
import { createCustomer, createPaymentIntent, savePaymentInfo, getPaymentIntentInfo, handleWebhookResponses } from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validation.js";
import { createCustomerSchema, createPaymentIntentSchema, savePaymentInfoSchema } from "../validationSchema/payment.js";
import bodyParser from "body-parser";
const router = Router();

router.route('/createpaymentintent').post(validate(createPaymentIntentSchema), createPaymentIntent);

router.route('/getpaymentintent/:paymentIntentId').get(getPaymentIntentInfo);

router.route('/createcustomer').post(validate(createCustomerSchema), createCustomer);

router.route('/savepaymentinfo').post(validate(savePaymentInfoSchema), savePaymentInfo)

router.route('/handlewebhookresponses').post(bodyParser.raw({ type: 'application/json' }),handleWebhookResponses)

export default router;