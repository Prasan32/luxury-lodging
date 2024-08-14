import Joi from "joi";

export const processContactSubmissionSchema = Joi.object({
    fullname: Joi.string().required().min(2).max(50).messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name must be at most 50 characters long',
    }),
    email: Joi.string().required().email().messages({
        'string.email': 'Invalid email address format',
    }),
    phoneNumber: Joi.string().required(),
    description: Joi.string().required()
});

export const createSubscriptionSchema = Joi.object({
    email: Joi.string().required().email().messages({
        'string.email': 'Invalid email address format',
    }),
});