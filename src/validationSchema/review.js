import Joi from "joi";

export const saveReviewSchema = Joi.object({
    review: Joi.string().required()
});

export const getReviewsSchema = Joi.object({
    listingId: Joi.number().required(),
    type: Joi.string().required().valid("guest-to-host", "host-to-guest")
});