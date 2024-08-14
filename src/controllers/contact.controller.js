import asyncHandler from "../middlewares/asyncHandler.js";
import contactServices from "../services/contact.service.js";

export const processContactSubmission = asyncHandler(async (req, res, next) => {
    const { fullname, email, phoneNumber, description } = req.body;
    await contactServices.processContactSubmission(fullname, email, phoneNumber, description);
    res.status(200).json({ message: "Contact form submitted successfully" });
});

export const createSubscription = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    await contactServices.createSubscription(email);
    res.status(201).json({ message: "Subscription created successfully" });
});