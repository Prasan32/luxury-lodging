import Joi from "joi";

export const getAvailableListingsSchema = Joi.object({
    location: Joi.string().required().allow(""),
    checkIn: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required().allow(""),
    checkOut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required().allow(""),
    guests: Joi.number().required().min(1).max(50).allow(""),
    priceOrder: Joi.string().valid('low-to-high', 'high-to-low').required().allow(""),
}).custom((value, helpers) => {
    if (value.checkIn !== "" && value.checkOut === "") {
        return helpers.message({ custom: '"checkOut" must not be empty when "checkIn" is provided' });
    }
    if (value.checkOut !== "" && value.checkIn === "") {
        return helpers.message({ custom: '"checkIn" must not be empty when "checkOut" is provided' });
    }
    return value;
});

export const getListingSchema = Joi.object({
    page: Joi.number(),
    limit: Joi.number(),
    priceOrder: Joi.string().valid('low-to-high', 'high-to-low').allow(""),
}).custom((value, helpers) => {
    if (value.page && value.page !== "" && (value.limit == undefined || value.limit == "")) {
        return helpers.message({ custom: '"limit" must be provided when "page" is provided' });
    }
    if (value.limit && value.limit !== "" && (value.page == undefined || value.page == "")) {
        return helpers.message({ custom: '"page" must not be empty when "limit" is provided' });
    }
    return value;
});