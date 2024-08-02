import asyncHandler from "../middlewares/asyncHandler.js";
import paymentServices from "../services/payment.service.js";

export const createPaymentIntent = asyncHandler(async (req, res, next) => {
    const { clientSecret } = await paymentServices.createPaymentIntent(req.body);
    return res.status(201).json({ clientSecret });
});