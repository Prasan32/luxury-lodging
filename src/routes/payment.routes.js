import express from "express";
import { createCustomer, createPaymentIntent, savePaymentInfo, getPaymentIntentInfo, getStripePublishableKey, updatePaymentIntent, createOrderWithHash } from "../controllers/payment.controller.js";
import { validate } from "../middlewares/validation.js";
import { createCustomerSchema, createOrderSchema, createPaymentIntentSchema, savePaymentInfoSchema, updatePaymentIntentSchema } from "../validationSchema/payment.js";
const router = express.Router();

router.route('/createpaymentintent').post(validate(createPaymentIntentSchema), createPaymentIntent);

router.route('/updatepaymentintent').put(validate(updatePaymentIntentSchema), updatePaymentIntent);

router.route('/getpaymentintent/:paymentIntentId').get(getPaymentIntentInfo);

router.route('/createcustomer').post(validate(createCustomerSchema), createCustomer);

router.route('/savepaymentinfo').post(validate(savePaymentInfoSchema), savePaymentInfo);

router.route('/stripepublishablekey').get(getStripePublishableKey);

router.route('/create-order').post(validate(createOrderSchema), createOrderWithHash)

export default router;