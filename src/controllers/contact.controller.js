import asyncHandler from "../middlewares/asyncHandler.js";
import contactServices from "../services/contact.service.js";

export const processContactSubmission = asyncHandler(async (req, res, next) => {
    const { fullname, email, phoneNumber, description } = req.body;
    await contactServices.processContactSubmission(fullname, email, phoneNumber, description);
    res.status(200).json({ message: "Contact form submitted successfully" });
});