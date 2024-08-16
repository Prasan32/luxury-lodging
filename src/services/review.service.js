import logger from "../config/winstonLoggerConfig.js";
import { Review } from "../models/index.js";
import HostAwayClient from "../clients/hostaway.js";

const saveReview = async (review) => {
    try {
        const createdReview = await Review.create({ review });
        return createdReview;
    } catch (error) {
        logger.error("Failed to save review", error);
        throw error;
    }
};

const getReviews = async (queryObj) => {
    const { listingId, type } = queryObj;
    const reviews = await HostAwayClient.getReviews(type);
    const filteredReviews = reviews.filter(review => review.listingMapId == listingId);
    return filteredReviews;
};

const reviewServices = {
    saveReview,
    getReviews
};

export default reviewServices;