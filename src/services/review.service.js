import logger from "../config/winstonLoggerConfig.js";
import { Review } from "../models/index.js";
import HostAwayClient from "../clients/hostaway.js";

const saveReview = async (review, listingId) => {
    try {
        const createdReview = await Review.create({ review, listingId });
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

const getTopReviews=async()=>{
   const reviews=await HostAwayClient.getTopReviews();
   const filteredReviews = reviews.filter(review => review.channelId == 2018 && review.status =="published" && review.rating==10);
   return filteredReviews;
};

const reviewServices = {
    saveReview,
    getReviews,
    getTopReviews
};

export default reviewServices;