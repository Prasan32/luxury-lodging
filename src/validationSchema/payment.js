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

export const createCustomerSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(50).messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must be at most 50 characters long',
    }),
    lastName: Joi.string().required().min(2).max(50).messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must be at most 50 characters long',
    }),
    email: Joi.string().required().email().messages({
        'string.email': 'Invalid email address format',
    }),
    phone: Joi.string().required(),
});

export const savePaymentInfoSchema = Joi.object({
    guestName: Joi.string().required(),
    guestEmail: Joi.string().required(),
    guestPhone: Joi.string().required(),
    listingId: Joi.number().required(),
    checkInDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    checkOutDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Date must be in the format "yyyy-mm-dd"',
    }).required(),
    guests: Joi.number().required(),
    paymentIntentId: Joi.string().required(),
    customerId: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    paymentStatus: Joi.string().required(),
    couponName: Joi.string().required().allow(null),
});