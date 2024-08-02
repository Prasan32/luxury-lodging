import Joi from "joi";

export const createPaymentIntentSchema = Joi.object({
    listingId: Joi.number().required(),
    checkIn: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    checkOut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    guests: Joi.number().required().min(1).max(50).required(),
    amount: Joi.number().required().min(1).messages({
        'number.min': 'Amount must be at least 1',
        'number.max': 'Amount must be at most 10000',
    }),
    currency: Joi.string().required(),
});