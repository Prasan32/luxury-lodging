import asyncHandler from "../middlewares/asyncHandler.js";
import reviewServices from "../services/review.service.js";
import redisClient from "../config/redis.js";
import { generateCacheKey, getCachedData, setDataInCache, setDataInCacheWithExpiration } from "../helpers/index.js";
import logger from "../config/winstonLoggerConfig.js";

export const saveReview = asyncHandler(async (req, res, next) => {
    const { review, listingId } = req.body;
    await reviewServices.saveReview(review, listingId);
    res.status(201).json({ message: "Review saved successfully!" });
});

export const getReviews = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const reviews = await reviewServices.getReviews(req.query);
    await setDataInCacheWithExpiration(cacheKey, 3600, reviews);

    return res.status(200).json(reviews);
});

export const getTopReviews = asyncHandler(async (req, res, next) => {
    const cacheKey = generateCacheKey(req.originalUrl);

    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const topReviews = await reviewServices.getTopReviews();
    await setDataInCacheWithExpiration(cacheKey, 3600, topReviews);

    return res.status(200).json(topReviews);
});