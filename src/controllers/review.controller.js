import asyncHandler from "../middlewares/asyncHandler.js";
import reviewServices from "../services/review.service.js";

export const saveReview = asyncHandler(async (req, res, next) => {
    const { review } = req.body;
    await reviewServices.saveReview(review);
    res.status(201).json({ message: "Review saved successfully!" });
});

export const getReviews = asyncHandler(async (req, res, next) => {
    const reviews = await reviewServices.getReviews(req.query);
    return res.status(200).json(reviews);
});