import Joi from "joi";

export const searchListingsSchema = Joi.object({
    location: Joi.string().required().allow(""),
    checkIn: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required().allow(""),
    checkOut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required().allow(""),
    guests: Joi.number().required().min(1).max(50).allow(""),
    priceOrder: Joi.string().valid('low-to-high', 'high-to-low').required().allow(""),
    bedrooms: Joi.number().required().allow(""),
    roomType: Joi.string().required().allow("").valid("entire_home", "private_room","shared_room"),
    minPrice: Joi.number().required().allow(""),
    maxPrice: Joi.number().required().allow(""),
    amenities: Joi.array().items(Joi.number().required()).required().min(0).allow(""),
}).custom((value, helpers) => {
    if (value.checkIn !== "" && value.checkOut === "") {
        return helpers.message({ custom: '"checkOut" must not be empty when "checkIn" is provided' });
    }
    if (value.checkOut !== "" && value.checkIn === "") {
        return helpers.message({ custom: '"checkIn" must not be empty when "checkOut" is provided' });
    }

    if (value.minPrice !== "" && value.maxPrice === "") {
        return helpers.message({ custom: '"maxPrice" must not be empty when "minPrice" is provided' });
    }

    if (value.maxPrice !== "" && value.minPrice === "") {
        return helpers.message({ custom: '"minPrice" must not be empty when "maxPrice" is provided' });
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

export const checkAvailabilitySchema = Joi.object({
    listingId: Joi.number().required(),
    checkIn: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    checkOut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
});

export const calculatePriceSchema = Joi.object({
    listingId: Joi.number().required(),
    checkIn: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    checkOut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    guests: Joi.number().required().min(1).max(50).required(),
});

export const getCalendarSchema = Joi.object({
    startDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
});

export const getDiscountPriceSchema = Joi.object({
    couponCode: Joi.string().required(),
    listingId: Joi.number().required(),
    checkInDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    checkOutDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    totalPrice: Joi.number().required()
});
