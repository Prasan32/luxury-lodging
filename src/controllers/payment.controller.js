import asyncHandler from "../middlewares/asyncHandler.js";
import paymentServices from "../services/payment.service.js";

export const createPaymentIntent = asyncHandler(async (req, res, next) => {
    const { clientSecret } = await paymentServices.createPaymentIntent(req.body);
    return res.status(201).json({ clientSecret });
});

export const createCustomer = asyncHandler(async (req, res, next) => {
    const customerId = await paymentServices.createCustomer(req.body);
    return res.status(201).json({ customerId });
});

export const savePaymentInfo = asyncHandler(async (req, res, next) => {
    const paymentInfo = await paymentServices.savePaymentInfo(req.body);
    return res.status(201).json({ paymentInfo });
});