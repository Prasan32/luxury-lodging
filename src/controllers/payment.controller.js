import asyncHandler from "../middlewares/asyncHandler.js";
import paymentServices from "../services/payment.service.js";

export const createPaymentIntent = asyncHandler(async (req, res, next) => {
    const { clientSecret, paymentIntentId } = await paymentServices.createPaymentIntent(req.body);
    return res.status(201).json({ clientSecret, paymentIntentId });
});

export const getPaymentIntentInfo = asyncHandler(async (req, res, next) => {
    const paymentIntent = await paymentServices.getPaymentIntentInfo(req.params.paymentIntentId);
    return res.status(200).json({ paymentIntent });
});

export const createCustomer = asyncHandler(async (req, res, next) => {
    const customerId = await paymentServices.createCustomer(req.body);
    return res.status(201).json({ customerId });
});

export const savePaymentInfo = asyncHandler(async (req, res, next) => {
    const paymentInfo = await paymentServices.savePaymentInfo(req.body);
    return res.status(201).json({ paymentInfo });
});

export const handleWebhookResponses = asyncHandler(async (req, res, next) => {
    await paymentServices.handleWebhookResponses(req);
    return res.status(200).json({ message: "Webhook response handled successfully" });
});

export const getStripePublishableKey = asyncHandler(async (req, res, next) => {
    const publishableKey = paymentServices.getStripePublishableKey();
    return res.status(200).json({ publishableKey });
});